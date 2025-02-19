
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Difficulty, Word } from "@/lib/game-data";

interface WordManagerProps {
  onGetWord: (word: Word | null) => void;
  onSetLoading: (loading: boolean) => void;
}

export const useWordManager = ({ onGetWord, onSetLoading }: WordManagerProps) => {
  const { toast } = useToast();

  const getRandomWord = async (difficulty: Difficulty) => {
    try {
      const categories = ['animals', 'science', 'arts', 'sports', 'food', 'geography', 'business', 'health'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      await supabase.functions.invoke('generate-words', {
        body: { difficulty, category: randomCategory }
      });

      const { count } = await supabase
        .from('word_pool')
        .select('*', { count: 'exact', head: true })
        .eq('difficulty', difficulty)
        .eq('category', randomCategory)
        .eq('active', true);

      const randomOffset = Math.floor(Math.random() * (count || 1));

      const { data: words, error } = await supabase
        .from('word_pool')
        .select('word, difficulty, category')
        .eq('difficulty', difficulty)
        .eq('category', randomCategory)
        .eq('active', true)
        .order('times_used', { ascending: true })
        .order('last_used_at', { ascending: true, nullsFirst: true })
        .limit(1)
        .range(randomOffset, randomOffset);

      if (error) {
        throw error;
      }

      if (!words || words.length === 0) {
        throw new Error('No words available');
      }

      onGetWord(words[0] as Word);
    } catch (error) {
      console.error('Error fetching word:', error);
      toast({
        title: "Error",
        description: "Failed to fetch a word. Please try again.",
        variant: "destructive"
      });
      onGetWord(null);
    } finally {
      onSetLoading(false);
    }
  };

  return { getRandomWord };
};
