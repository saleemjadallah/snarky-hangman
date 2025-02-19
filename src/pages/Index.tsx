
import { useState, useEffect } from "react";
import { GameBoard } from "@/components/GameBoard";
import { DifficultySelector } from "@/components/DifficultySelector";
import { type Difficulty, type Word } from "@/lib/game-data";
import { Header } from "@/components/layout/Header";
import { IntroSection } from "@/components/game/IntroSection";
import { GameControls } from "@/components/game/GameControls";
import { RegistrationModal } from "@/components/RegistrationModal";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileSync } from "@/hooks/use-profile-sync";
import { ChallengeLoader } from "@/components/game/ChallengeLoader";
import { useWordManager } from "@/components/game/WordManager";
import { useGameStatsManager } from "@/components/game/GameStatsManager";

const Index = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isGuest } = useAuth();

  // Use the profile sync hook
  useProfileSync();

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

  useEffect(() => {
    if (!user && !isGuest && !isLoading) {
      setShowRegistration(true);
    } else {
      setShowRegistration(false);
    }
  }, [user, isGuest, isLoading]);

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
    <div className="min-h-screen w-full bg-background">
      <Header />

      <ChallengeLoader
        onSetDifficulty={setDifficulty}
        onSetCurrentWord={setCurrentWord}
        onSetLoading={setIsLoading}
      />

      <main className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
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
        </div>
      </main>

      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
      />
    </div>
  );
};

export default Index;
