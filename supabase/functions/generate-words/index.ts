
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const CATEGORIES = [
  'animals',
  'science',
  'arts',
  'sports',
  'food',
  'geography',
  'business',
  'health'
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateWords(difficulty: string, category: string): Promise<string[]> {
  const prompt = {
    easy: `Generate 10 common English words that are:
    - 4-6 letters long
    - Commonly known by elementary school students
    - No proper nouns, slang, or abbreviations
    - Related to: ${category}
    Format: Return only the words in a comma-separated list.`,
    medium: `Generate 10 English words that are:
    - 6-8 letters long
    - Commonly known by high school students
    - No proper nouns, slang, or abbreviations
    - Related to: ${category}
    Format: Return only the words in a comma-separated list.`,
    hard: `Generate 10 challenging English words that are:
    - 8+ letters long
    - College-level vocabulary
    - Academic or technical terms
    - No proper nouns or abbreviations
    - Related to: ${category}
    Format: Return only the words in a comma-separated list.`
  }[difficulty];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      console.error('Anthropic API error:', await response.text());
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    const wordList = data.content[0].text
      .split(',')
      .map((word: string) => word.trim().toUpperCase())
      .filter((word: string) => word.length > 0);

    return wordList;
  } catch (error) {
    console.error('Error generating words:', error);
    throw error;
  }
}

async function upsertWords(words: string[], difficulty: string, category: string) {
  try {
    // First, check which words already exist
    const { data: existingWords, error: checkError } = await supabase
      .from('word_pool')
      .select('word')
      .in('word', words);

    if (checkError) {
      console.error('Error checking existing words:', checkError);
      throw checkError;
    }

    const existingWordSet = new Set(existingWords?.map(w => w.word) || []);
    const newWords = words.filter(word => !existingWordSet.has(word));

    if (newWords.length > 0) {
      console.log('Inserting new words:', newWords);
      const { error: insertError } = await supabase
        .from('word_pool')
        .insert(newWords.map(word => ({
          word,
          difficulty,
          category,
          times_used: 0,
          success_rate: 0,
          active: true
        })));

      if (insertError) {
        console.error('Error inserting new words:', insertError);
        throw insertError;
      }
    }

    // Reactivate existing words
    if (existingWordSet.size > 0) {
      console.log('Reactivating existing words:', Array.from(existingWordSet));
      const { error: updateError } = await supabase
        .from('word_pool')
        .update({ active: true })
        .in('word', Array.from(existingWordSet));

      if (updateError) {
        console.error('Error updating existing words:', updateError);
        throw updateError;
      }
    }
  } catch (error) {
    console.error('Error in upsertWords:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const { difficulty, category } = await req.json();
    console.log('Received request:', { difficulty, category });

    if (!difficulty || !category) {
      throw new Error('Missing required parameters');
    }

    // Check current word pool status
    const { data: poolStats, error: statsError } = await supabase
      .from('word_pool_stats')
      .select('*')
      .eq('difficulty', difficulty)
      .eq('category', category)
      .single();

    if (statsError && statsError.code !== 'PGRST116') { // Ignore "no rows returned" error
      console.error('Error checking pool stats:', statsError);
      throw statsError;
    }

    // Generate new words if pool is low or doesn't exist
    if (!poolStats || poolStats.active_words < 50) {
      console.log(`Generating new words for ${difficulty} ${category}`);
      const newWords = await generateWords(difficulty, category);
      await upsertWords(newWords, difficulty, category);
      console.log(`Successfully added/updated ${newWords.length} words`);
    } else {
      console.log('Sufficient words in pool:', poolStats.active_words);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-words function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack || 'No stack trace available'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
