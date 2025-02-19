
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Challenge } from "@/types/database";
import type { Difficulty, Word } from "@/lib/game-data";

interface ChallengeLoaderProps {
  onSetDifficulty: (difficulty: Difficulty) => void;
  onSetCurrentWord: (word: Word) => void;
  onSetLoading: (loading: boolean) => void;
}

export const ChallengeLoader = ({ 
  onSetDifficulty, 
  onSetCurrentWord, 
  onSetLoading 
}: ChallengeLoaderProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const loadChallenge = async () => {
      const params = new URLSearchParams(window.location.search);
      const challengeId = params.get('challenge');
      
      if (challengeId) {
        try {
          onSetLoading(true);
          const { data: challenge, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', challengeId)
            .single();

          if (error) throw error;
          
          if (challenge) {
            const typedChallenge = challenge as Challenge;
            onSetDifficulty(typedChallenge.difficulty);
            onSetCurrentWord({
              word: typedChallenge.word,
              category: 'challenge',
              difficulty: typedChallenge.difficulty
            });
            
            // Clear the challenge ID from URL without refreshing
            window.history.replaceState({}, '', '/');
            
            toast({
              title: "Challenge Accepted!",
              description: "Show them what you've got!",
            });
          }
        } catch (error) {
          console.error('Error loading challenge:', error);
          toast({
            title: "Error loading challenge",
            description: "This challenge might have expired or been removed.",
            variant: "destructive",
          });
        } finally {
          onSetLoading(false);
        }
      }
    };

    loadChallenge();
  }, []);

  return null;
};
