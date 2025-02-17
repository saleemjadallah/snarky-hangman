
import { Button } from "@/components/ui/button";

interface LetterGridProps {
  guessedLetters: string[];
  isGameOver: boolean;
  onGuess: (letter: string) => void;
}

export const LetterGrid = ({ guessedLetters, isGameOver, onGuess }: LetterGridProps) => {
  return (
    <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
      {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
        <Button
          key={letter}
          variant={guessedLetters.includes(letter) ? "secondary" : "outline"}
          className={`w-10 h-10 ${
            guessedLetters.includes(letter) ? "opacity-50" : "btn-hover"
          }`}
          disabled={guessedLetters.includes(letter) || isGameOver}
          onClick={() => onGuess(letter)}
        >
          {letter}
        </Button>
      ))}
    </div>
  );
};
