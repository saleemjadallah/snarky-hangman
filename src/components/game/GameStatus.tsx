
import { MessageCircle } from "lucide-react";

interface GameStatusProps {
  remainingGuesses: number;
  message: string;
}

export const GameStatus = ({ remainingGuesses, message }: GameStatusProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Remaining Guesses: {remainingGuesses}
      </div>
      {message && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <MessageCircle size={16} />
          {message}
        </div>
      )}
    </div>
  );
};
