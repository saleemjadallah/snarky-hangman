
import { useState } from "react";
import { GameBoard } from "@/components/GameBoard";
import { DifficultySelector } from "@/components/DifficultySelector";
import { words, type Difficulty, type Word } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { Logo } from "@/components/Logo";

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
    <div className="min-h-screen w-full">
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
      
      <div className="px-4 py-8 space-y-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-primary">Snarky Hangman</h1>
          <p className="text-muted-foreground">
            Can you outsmart the world's most condescending word game?
          </p>
          {score > 0 && (
            <p className="text-lg font-semibold text-secondary">Score: {score}</p>
          )}
        </div>

        <div className="max-w-[600px] mx-auto px-6 text-center space-y-4 animate-fade-in">
          <p className="text-[#2D3748] leading-relaxed text-base sm:text-lg">
            Think you're a wordsmith? Put your vocabulary to the test against our sarcastically superior AI. Fair warning: our AI has devoured dictionaries for breakfast and takes peculiar joy in watching humans squirm. Choose your difficulty level, pick your avatar, and prepare to be lovingly mocked for every wrong guess. Don't worry though – even if you lose, you'll at least get a good laugh out of it.
          </p>
          <p className="text-[#2D3748] font-medium text-base sm:text-lg">
            Ready to prove you're smarter than a particularly smug algorithm?
          </p>
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
    </div>
  );
};

export default Index;
