
import { useState } from "react";
import { GameBoard } from "@/components/GameBoard";
import { DifficultySelector } from "@/components/DifficultySelector";
import { words, type Difficulty, type Word } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

const getRandomWord = (difficulty: Difficulty): Word => {
  const filteredWords = words.filter((word) => word.difficulty === difficulty);
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
};

const Index = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score, setScore] = useState(0);

  const handleDifficultySelect = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setCurrentWord(getRandomWord(selectedDifficulty));
  };

  const handleGameEnd = (won: boolean, gameScore: number) => {
    if (won) {
      setScore((prev) => prev + gameScore);
    }
    setCurrentWord(null);
  };

  const handlePlayAgain = () => {
    if (difficulty) {
      setCurrentWord(getRandomWord(difficulty));
    }
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 space-y-8">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold text-primary">Snarky Hangman</h1>
        <p className="text-muted-foreground">
          Can you outsmart the world's most condescending word game?
        </p>
        {score > 0 && (
          <p className="text-lg font-semibold text-secondary">Score: {score}</p>
        )}
      </div>

      {!difficulty && <DifficultySelector onSelect={handleDifficultySelect} />}

      {difficulty && !currentWord && (
        <div className="flex justify-center">
          <Button
            onClick={handlePlayAgain}
            className="btn-hover"
            size="lg"
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </div>
      )}

      {currentWord && (
        <GameBoard
          currentWord={currentWord}
          difficulty={difficulty}
          onGameEnd={handleGameEnd}
        />
      )}
    </div>
  );
};

export default Index;
