
import { Button } from "@/components/ui/button";
import { RotateCw, Loader2 } from "lucide-react";
import type { Difficulty } from "@/lib/game-data";
import { ChallengeButton } from "./ChallengeButton";

interface GameControlsProps {
  isLoading: boolean;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  showChallenge?: boolean;
  gameStats?: {
    word: string;
    score: number;
    difficulty: Difficulty;
    timeRemaining: number;
    hintsUsed: number;
  };
}

export const GameControls = ({ 
  isLoading, 
  onPlayAgain, 
  onChangeDifficulty,
  showChallenge = false,
  gameStats
}: GameControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {isLoading ? (
        <Button disabled className="btn-hover" size="lg">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      ) : (
        <>
          {showChallenge && gameStats && (
            <ChallengeButton
              word={gameStats.word}
              score={gameStats.score}
              difficulty={gameStats.difficulty}
              timeRemaining={gameStats.timeRemaining}
              hintsUsed={gameStats.hintsUsed}
            />
          )}
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
