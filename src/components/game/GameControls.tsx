
import { Button } from "@/components/ui/button";
import { RotateCw, Loader2 } from "lucide-react";
import type { Difficulty } from "@/lib/game-data";

interface GameControlsProps {
  isLoading: boolean;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
}

export const GameControls = ({ isLoading, onPlayAgain, onChangeDifficulty }: GameControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {isLoading ? (
        <Button disabled className="btn-hover" size="lg">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      ) : (
        <>
          <Button onClick={onPlayAgain} className="btn-hover" size="lg">
            <RotateCw className="mr-2 h-4 w-4" />
            Play Again (Same Difficulty)
          </Button>
          <Button onClick={onChangeDifficulty} variant="outline" size="lg">
            Change Difficulty
          </Button>
        </>
      )}
    </div>
  );
};
