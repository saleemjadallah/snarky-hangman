
import { useState } from "react";
import { type Difficulty, type Word } from "@/lib/game-data";
import { IntroSection } from "@/components/game/IntroSection";
import { DifficultySelector } from "@/components/DifficultySelector";
import { GameControls } from "@/components/game/GameControls";
import { GameBoard } from "@/components/GameBoard";
import { useWordManager } from "@/components/game/WordManager";
import { useGameStatsManager } from "@/components/game/GameStatsManager";
import { useAuth } from "@/contexts/AuthContext";

export const GameManager = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isGuest } = useAuth();

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

  const handleDifficultySelect = async (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setIsLoading(true);
    await getRandomWord(selectedDifficulty);
  };

  const handlePlayAgain = async () => {
    if (difficulty) {
      setIsLoading(true);
      await getRandomWord(difficulty);
    }
  };

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
