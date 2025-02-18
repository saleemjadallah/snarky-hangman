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
import type { Difficulty, Category } from "@/lib/game-data";

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

  const getSubCategoryHint = (category: Category, word: string) => {
    const hints: Record<Category, string[]> = {
      animals: [
        "This creature is a mammal",
        "This is a sea creature",
        "This animal flies",
        "This is a domesticated animal",
        "This is a wild animal",
        "This creature is a reptile",
      ],
      science: [
        "This is a scientific process",
        "This is a scientific instrument",
        "This is a chemical element",
        "This is a scientific theory",
        "This relates to astronomy",
        "This is a biological term",
      ],
      arts: [
        "This is an art movement",
        "This is an artistic technique",
        "This relates to music",
        "This is a type of performance",
        "This is a famous artwork",
        "This is an artistic tool",
      ],
      sports: [
        "This is team sport equipment",
        "This is an individual sport",
        "This is a sports position",
        "This is a sporting technique",
        "This is a sports venue",
        "This is a sports rule term",
      ],
      food: [
        "This is a type of cuisine",
        "This is a cooking method",
        "This is a kitchen utensil",
        "This is a type of ingredient",
        "This is a dish type",
        "This is a spice or seasoning",
      ],
      geography: [
        "This is a landform",
        "This is a type of climate",
        "This relates to water bodies",
        "This is a geographic region",
        "This is a geographic term",
        "This relates to map features",
      ],
      business: [
        "This is a financial term",
        "This is a business role",
        "This is a type of transaction",
        "This is a business strategy",
        "This is an economic concept",
        "This is a market term",
      ],
      health: [
        "This is a medical condition",
        "This is a body part",
        "This is a medical procedure",
        "This is a health practice",
        "This is medical equipment",
        "This is a wellness term",
      ],
    };

    const relevantHints = hints[category as Category];
    return relevantHints[Math.floor(Math.random() * relevantHints.length)];
  };

  const getRandomSnarkyResponse = () => {
    return snarkyResponses[Math.floor(Math.random() * snarkyResponses.length)];
  };

  const getLetterHint = () => {
    const unguessedLetters = word
      .split("")
      .filter(letter => !guessedLetters.includes(letter));
    
    if (unguessedLetters.length === 0) return null;

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
      case "subcategory":
        hintContent = getSubCategoryHint(category as Category, word);
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
