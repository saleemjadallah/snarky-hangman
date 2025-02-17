
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FetchWordsRequest {
  difficulty: string;
  count: number;
  excludeWords?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { difficulty, count, excludeWords = [] } = await req.json() as FetchWordsRequest

    console.log(`Fetching ${count} words for difficulty: ${difficulty}`)

    // Fetch words that:
    // 1. Match the difficulty
    // 2. Are active
    // 3. Haven't been used recently
    // 4. Aren't in the exclude list
    const { data: words, error } = await supabaseClient
      .from('word_pool')
      .select('word, category, difficulty')
      .eq('difficulty', difficulty)
      .eq('active', true)
      .not('word', 'in', `(${excludeWords.join(',')})`)
      .order('last_used_at', { ascending: true, nullsFirst: true })
      .limit(count)

    if (error) {
      throw error
    }

    console.log(`Successfully fetched ${words.length} words`)

    return new Response(
      JSON.stringify(words),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
