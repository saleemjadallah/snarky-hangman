
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Difficulty } from "@/lib/game-data";

interface TimerProps {
  timeRemaining: number;
  isGameFinished: boolean;
  isGameOver: boolean;
  onTimeUpdate: (newTime: number) => void;
  difficulty: Difficulty;
}

export const Timer = ({ 
  timeRemaining, 
  isGameFinished, 
  isGameOver, 
  onTimeUpdate,
  difficulty
}: TimerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!isGameFinished && !isGameOver) {
      const timer = setInterval(() => {
        onTimeUpdate(timeRemaining <= 1 ? 0 : timeRemaining - 1);
        
        if (timeRemaining <= 1) {
          clearInterval(timer);
          toast({
            title: "Time's up!",
            description: "Maybe try typing faster next time?",
            variant: "destructive",
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isGameFinished, isGameOver, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 30) {
      toast({
        title: "Tick tock!",
        description: "No time for Google now!",
        variant: "default",
      });
    } else if (timeRemaining === 10) {
      toast({
        title: "Almost out of time!",
        description: "Hope you're good at quick thinking!",
        variant: "destructive",
      });
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClassName = () => {
    let className = "timer text-2xl font-bold px-4 py-2 rounded-xl transition-colors duration-300";
    if (timeRemaining <= 10) {
      className += " text-red-500 animate-pulse-fast";
    } else if (timeRemaining <= 30) {
      className += " text-yellow-500 animate-pulse";
    }
    return className;
  };

  return (
    <div className="flex justify-center">
      <div className={getTimerClassName()}>
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
};
