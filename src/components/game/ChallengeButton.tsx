
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChallengeButtonProps {
  word: string;
  score: number;
  difficulty: string;
  timeRemaining: number;
  hintsUsed: number;
}

export const ChallengeButton = ({ word, score, difficulty, timeRemaining, hintsUsed }: ChallengeButtonProps) => {
  const handleChallenge = () => {
    const message = generateChallengeMessage(word, score, timeRemaining, hintsUsed, difficulty);
    
    // For now, we'll just use the Web Share API
    if (navigator.share) {
      navigator.share({
        title: 'Snarky Hangman Challenge',
        text: message,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(message)
        .then(() => {
          alert('Challenge link copied to clipboard!');
        })
        .catch(console.error);
    }
  };

  return (
    <Button
      onClick={handleChallenge}
      className={cn(
        "bg-secondary hover:bg-secondary/90 text-primary",
        "flex items-center gap-2 w-full md:w-auto",
        "animate-pulse-fast"
      )}
      size="lg"
    >
      <Share2 className="w-4 h-4" />
      Challenge Friends
    </Button>
  );
};

const generateChallengeMessage = (
  word: string,
  score: number,
  timeRemaining: number,
  hintsUsed: number,
  difficulty: string
) => {
  const messages = [
    `I just crushed '${word}' with ${score} points! Think you can beat that? 😏`,
    `Just solved '${word}' with ${hintsUsed} hints. Surely you won't need any... right? 🤔`,
    `Aced '${word}' on ${difficulty} mode! Your turn, smarty-pants! 🎯`,
    `Barely solved '${word}' with ${timeRemaining}s left. Think you can do better? 🫣`
  ];

  return messages[Math.floor(Math.random() * messages.length)];
};
