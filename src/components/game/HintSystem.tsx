
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, LightbulbOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Difficulty, Category } from "@/lib/game-data";
import { 
  getSubCategoryHint, 
  getLetterHint, 
  getWordPattern,
  getSnarkyResponse 
} from "@/utils/hint-generators";

interface HintSystemProps {
  difficulty: Difficulty;
  word: string;
  category: string;
  guessedLetters: string[];
  onHintUsed: () => void;
}

export const HintSystem = ({ 
  difficulty, 
  word, 
  category,
  guessedLetters,
  onHintUsed 
}: HintSystemProps) => {
  const [hintsRemaining, setHintsRemaining] = useState<number>(0);
  const [usedHintTypes, setUsedHintTypes] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Reset hints when word changes or difficulty changes
  useEffect(() => {
    const initialHints = (() => {
      switch (difficulty) {
        case "easy": return 3;
        case "medium": return 2;
        case "hard": return 1;
      }
    })();
    setHintsRemaining(initialHints);
    setUsedHintTypes(new Set());
  }, [word, difficulty]);

  const useHint = (hintType: string) => {
    if (hintsRemaining <= 0) {
      toast({
        title: "No hints remaining!",
        description: "You'll have to use your brain for this one.",
        variant: "destructive",
      });
      return;
    }

    if (usedHintTypes.has(hintType)) {
      toast({
        title: "Hint already used!",
        description: "Try a different type of hint.",
        variant: "destructive",
      });
      return;
    }

    let hintContent = "";
    switch (hintType) {
      case "subcategory":
        hintContent = getSubCategoryHint(category as Category, word);
        break;
      case "letter":
        const letterHint = getLetterHint(word, guessedLetters);
        if (!letterHint) {
          toast({
            title: "No letter hints available",
            description: "You've already found all the letters!",
            variant: "destructive",
          });
          return;
        }
        hintContent = `Try the letter: ${letterHint.toUpperCase()}`;
        break;
      case "pattern":
        hintContent = getWordPattern(word, guessedLetters);
        break;
      default:
        return;
    }

    setHintsRemaining(prev => prev - 1);
    setUsedHintTypes(prev => new Set([...prev, hintType]));
    onHintUsed();

    toast({
      title: getSnarkyResponse(),
      description: hintContent,
    });
  };

  return (
    <div className="flex items-center justify-center gap-2 my-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`hint-button ${hintsRemaining > 0 ? 'hover:bg-yellow-100' : 'opacity-50'}`}
            disabled={hintsRemaining <= 0}
          >
            {hintsRemaining > 0 ? (
              <Lightbulb className="h-4 w-4 text-yellow-500" />
            ) : (
              <LightbulbOff className="h-4 w-4" />
            )}
            <span className="hint-count">
              {hintsRemaining} {hintsRemaining === 1 ? 'hint' : 'hints'} remaining
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border shadow-lg">
          <DropdownMenuItem
            onClick={() => useHint("subcategory")}
            disabled={usedHintTypes.has("subcategory")}
            className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span>Subcategory Hint</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => useHint("letter")}
            disabled={usedHintTypes.has("letter")}
            className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span>Reveal Letter</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => useHint("pattern")}
            disabled={usedHintTypes.has("pattern")}
            className="gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span>Word Pattern</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
