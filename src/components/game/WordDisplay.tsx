
import { Badge } from "@/components/ui/badge";
import { Avatar } from "../avatar/Avatar";
import { difficultySettings } from "@/lib/game-data";
import type { Difficulty } from "@/lib/game-data";

interface WordDisplayProps {
  word: string;
  category: string;
  guessedLetters: string[];
  wrongGuesses: number;
  difficulty: Difficulty;
  gameWon: boolean;
  isGameOver: boolean;
}

export const WordDisplay = ({
  word,
  category,
  guessedLetters,
  wrongGuesses,
  difficulty,
  gameWon,
  isGameOver,
}: WordDisplayProps) => {
  const maskWord = (word: string) => {
    return word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  return (
    <div className="space-y-4">
      <Badge variant="outline" className="text-sm">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
      <div className="flex items-center justify-between gap-8">
        <div className="text-4xl font-bold tracking-wider text-primary">
          {maskWord(word)}
        </div>
        <Avatar
          wrongGuesses={wrongGuesses}
          maxGuesses={difficultySettings[difficulty].maxGuesses}
          gameWon={gameWon}
          isGameOver={isGameOver}
          className="hidden md:block"
        />
      </div>
    </div>
  );
};
