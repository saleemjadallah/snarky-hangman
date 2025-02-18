
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, LightbulbOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { Difficulty } from "@/lib/game-data";

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
  const [hintsRemaining, setHintsRemaining] = useState(() => {
    switch (difficulty) {
      case "easy": return 3;
      case "medium": return 2;
      case "hard": return 1;
    }
  });
  const [usedHintTypes, setUsedHintTypes] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const snarkyResponses = [
    "Need a little help? How adorable.",
    "Oh, looking for a lifeline already?",
    "Fine, I'll give you a tiny peek...",
    "I suppose even Einstein needed help sometimes... not with this though.",
  ];

  const getRandomSnarkyResponse = () => {
    return snarkyResponses[Math.floor(Math.random() * snarkyResponses.length)];
  };

  const getLetterHint = () => {
    const unguessedLetters = word
      .split("")
      .filter(letter => !guessedLetters.includes(letter));
    
    if (unguessedLetters.length === 0) return null;

    // Prioritize vowels and common letters
    const vowels = unguessedLetters.filter(letter => "aeiou".includes(letter.toLowerCase()));
    if (vowels.length > 0) {
      return vowels[Math.floor(Math.random() * vowels.length)];
    }

    return unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
  };

  const getWordPattern = () => {
    const pattern = word.split("").map(letter => {
      if (guessedLetters.includes(letter)) return letter;
      return "_";
    }).join(" ");
    
    // Add additional context based on word length
    const context = word.length <= 4 ? "short word" : 
                   word.length <= 6 ? "medium word" : "long word";
    
    return `Pattern: ${pattern} (${context})`;
  };

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
      case "category":
        hintContent = `Category: ${category}`;
        break;
      case "letter":
        const letterHint = getLetterHint();
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
        hintContent = getWordPattern();
        break;
      default:
        return;
    }

    setHintsRemaining(prev => prev - 1);
    setUsedHintTypes(prev => new Set([...prev, hintType]));
    onHintUsed();

    toast({
      title: getRandomSnarkyResponse(),
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
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem
            onClick={() => useHint("category")}
            disabled={usedHintTypes.has("category")}
            className="gap-2"
          >
            <span>Category Hint</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => useHint("letter")}
            disabled={usedHintTypes.has("letter")}
            className="gap-2"
          >
            <span>Reveal Letter</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => useHint("pattern")}
            disabled={usedHintTypes.has("pattern")}
            className="gap-2"
          >
            <span>Word Pattern</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
