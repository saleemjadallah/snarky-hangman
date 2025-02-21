
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Difficulty, Word } from "@/lib/game-data";

interface GameStatsManagerProps {
  user: { id: string } | null;
  isGuest: boolean;
  difficulty: Difficulty | null;
  currentWord: Word | null;
  onGameCompleted: () => void;
  onUpdateScore: (score: number) => void;
}

export const useGameStatsManager = ({
  user,
  isGuest,
  difficulty,
  currentWord,
  onGameCompleted,
  onUpdateScore
}: GameStatsManagerProps) => {
  const { toast } = useToast();

  const handleGameEnd = async (won: boolean, gameScore: number) => {
    if (!user && !isGuest) return;

    try {
      const { error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user?.id,
          difficulty: difficulty,
          word_category: currentWord?.category,
          score: gameScore,
          wrong_guesses: won ? 0 : 6,
          perfect_game: won,
          abandoned: !won
        });

      if (sessionError) throw sessionError;

      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (fetchError) throw fetchError;

      const difficultyColumn = `${difficulty}_games_played`;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          [difficultyColumn]: (currentProfile?.[difficultyColumn] || 0) + 1,
          total_score: (currentProfile?.total_score || 0) + (won ? gameScore : 0),
          best_score: won ? Math.max(currentProfile?.best_score || 0, gameScore) : currentProfile?.best_score || 0,
          perfect_games: currentProfile?.perfect_games + (won ? 1 : 0),
          current_streak: won ? (currentProfile?.current_streak || 0) + 1 : 0,
          longest_streak: won ? 
            Math.max(currentProfile?.longest_streak || 0, (currentProfile?.current_streak || 0) + 1) : 
            currentProfile?.longest_streak || 0,
          last_played_at: new Date().toISOString(),
          last_streak_update: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      // Trigger a refresh event on the profiles channel
      await supabase.channel('profile-game-limits').send({
        type: 'broadcast',
        event: 'game-completed',
        payload: { user_id: user?.id }
      });

      if (won) {
        onUpdateScore(gameScore);
      }

      onGameCompleted();

      await supabase.rpc('maintain_word_pools');
    } catch (error) {
      console.error('Error updating game stats:', error);
      toast({
        title: "Error",
        description: "Failed to update game statistics.",
        variant: "destructive"
      });
    }
  };

  return { handleGameEnd };
};
