
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { type Difficulty, type Word } from "@/lib/game-data";
import { IntroSection } from "@/components/game/IntroSection";
import { DifficultySelector } from "@/components/DifficultySelector";
import { GameControls } from "@/components/game/GameControls";
import { GameBoard } from "@/components/GameBoard";
import { useWordManager } from "@/components/game/WordManager";
import { useGameStatsManager } from "@/components/game/GameStatsManager";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const GameManager = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [canPlayMore, setCanPlayMore] = useState(true);
  const { user, isGuest } = useAuth();
  const { toast } = useToast();

  // Initialize word manager
  const { getRandomWord } = useWordManager({
    onGetWord: setCurrentWord,
    onSetLoading: setIsLoading
  });

  // Initialize game stats manager
  const { handleGameEnd } = useGameStatsManager({
    user,
    isGuest,
    difficulty,
    currentWord,
    onGameCompleted: () => {
      setCurrentWord(null);
      setDifficulty(null);
    },
    onUpdateScore: (gameScore) => setScore(prev => prev + gameScore)
  });

  const checkGameLimit = async () => {
    if (!user) return true;

    const { data, error } = await supabase
      .from('profiles')
      .select('daily_games_played, daily_games_limit')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !data) {
      console.error('Error checking game limit:', error);
      return true;
    }

    const remaining = (data.daily_games_limit || 10) - (data.daily_games_played || 0);
    setCanPlayMore(remaining > 0);
    return remaining > 0;
  };

  useEffect(() => {
    checkGameLimit();
  }, [user]);

  const handleDifficultySelect = async (selectedDifficulty: Difficulty) => {
    if (!await checkGameLimit()) {
      toast({
        title: "Daily limit reached!",
        description: "Come back tomorrow for more intellectual humiliation!",
        variant: "destructive",
      });
      return;
    }

    setDifficulty(selectedDifficulty);
    setIsLoading(true);
    await getRandomWord(selectedDifficulty);
  };

  const handlePlayAgain = async () => {
    if (!await checkGameLimit()) {
      toast({
        title: "Daily limit reached!",
        description: "Come back tomorrow for more intellectual humiliation!",
        variant: "destructive",
      });
      return;
    }

    if (difficulty) {
      setIsLoading(true);
      await getRandomWord(difficulty);
    }
  };

  if (!canPlayMore && user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground">Daily Limit Reached!</h2>
        <p className="text-lg text-foreground/80">
          You've reached your daily game limit. Come back tomorrow for more intellectual humiliation!
        </p>
        <p className="text-sm text-foreground/60">
          In the meantime, why not review your past games or check the leaderboard?
        </p>
      </div>
    );
  }

  return (
    <>
      <IntroSection score={score} />

      {!difficulty && <DifficultySelector onSelect={handleDifficultySelect} />}

      {difficulty && !currentWord && (
        <GameControls
          isLoading={isLoading}
          onPlayAgain={handlePlayAgain}
          onChangeDifficulty={() => setDifficulty(null)}
        />
      )}

      {currentWord && (
        <GameBoard
          currentWord={currentWord}
          difficulty={difficulty}
          onGameEnd={handleGameEnd}
        />
      )}
    </>
  );
};
