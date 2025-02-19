
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ChallengeButtonProps {
  word: string;
  score: number;
  difficulty: string;
  timeRemaining: number;
  hintsUsed: number;
}

export const ChallengeButton = ({ word, score, difficulty, timeRemaining, hintsUsed }: ChallengeButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleChallenge = async () => {
    try {
      // Create challenge in database
      const { data: challenge, error } = await supabase
        .from('challenges')
        .insert({
          creator_id: user?.id,
          word,
          difficulty,
          score,
          time_remaining: timeRemaining,
          hints_used: hintsUsed
        })
        .select()
        .single();

      if (error) throw error;

      const challengeUrl = `${window.location.origin}?challenge=${challenge.id}`;
      const message = generateChallengeMessage(word, score, timeRemaining, hintsUsed, difficulty);

      // Try native share API first
      if (navigator.share) {
        await navigator.share({
          title: 'Snarky Hangman Challenge',
          text: message,
          url: challengeUrl
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${message}\n\n${challengeUrl}`);
        toast({
          title: "Challenge link copied!",
          description: "Share it with your friends and see if they can beat your score!",
        });
      }
    } catch (error: any) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Error creating challenge",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
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
