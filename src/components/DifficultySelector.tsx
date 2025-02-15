
import { Button } from "@/components/ui/button";
import { difficultySettings } from "@/lib/game-data";
import type { Difficulty } from "@/lib/game-data";
import { Sparkles, Zap, Skull } from "lucide-react";

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

export const DifficultySelector = ({ onSelect }: DifficultySelectorProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-6 glass rounded-xl">
      <h2 className="text-2xl font-bold text-primary mb-6">Select Difficulty</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button
          variant="outline"
          className="p-6 h-auto flex flex-col items-center gap-4 card-hover"
          onClick={() => onSelect("easy")}
        >
          <Sparkles className="w-8 h-8 text-blue-400" />
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Easy</h3>
            <p className="text-sm text-muted-foreground">
              {difficultySettings.easy.maxGuesses} guesses
            </p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="p-6 h-auto flex flex-col items-center gap-4 card-hover"
          onClick={() => onSelect("medium")}
        >
          <Zap className="w-8 h-8 text-yellow-500" />
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Medium</h3>
            <p className="text-sm text-muted-foreground">
              {difficultySettings.medium.maxGuesses} guesses
            </p>
          </div>
        </Button>

        <Button
          variant="outline"
          className="p-6 h-auto flex flex-col items-center gap-4 card-hover"
          onClick={() => onSelect("hard")}
        >
          <Skull className="w-8 h-8 text-red-500" />
          <div className="space-y-2 text-center">
            <h3 className="font-semibold">Hard</h3>
            <p className="text-sm text-muted-foreground">
              {difficultySettings.hard.maxGuesses} guesses
            </p>
          </div>
        </Button>
      </div>
    </div>
  );
};
