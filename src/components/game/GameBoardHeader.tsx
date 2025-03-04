
import { Timer } from "./Timer";
import { Difficulty } from "@/lib/game-data";

interface GameBoardHeaderProps {
  timeRemaining: number;
  isGameFinished: boolean;
  isGameOver: boolean;
  onTimeUpdate: (newTime: number) => void;
  difficulty: Difficulty;
  gameWon: boolean;
  gameScore: number;
}

export const GameBoardHeader = ({
  timeRemaining,
  isGameFinished,
  isGameOver,
  onTimeUpdate,
  difficulty,
  gameWon,
  gameScore
}: GameBoardHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <Timer
        timeRemaining={timeRemaining}
        isGameFinished={isGameFinished}
        isGameOver={isGameOver}
        onTimeUpdate={onTimeUpdate}
        difficulty={difficulty}
      />
      {isGameFinished && gameWon && (
        <div className="text-lg font-bold text-primary">
          Score: {gameScore}
        </div>
      )}
    </div>
  );
};
