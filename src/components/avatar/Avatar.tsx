import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpeechBubble } from "./SpeechBubble";
import { AvatarPart } from "./AvatarPart";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  wrongGuesses: number;
  maxGuesses: number;
  gameWon: boolean;
  isGameOver: boolean;
  onAnimationComplete?: () => void;
  className?: string;
}

export const Avatar = ({
  wrongGuesses,
  maxGuesses,
  gameWon,
  isGameOver,
  onAnimationComplete,
  className
}: AvatarProps) => {
  const [message, setMessage] = useState<string>("");
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  const wrongGuessMessages = [
    "Oh, here we go...",
    "Getting warmer... sort of",
    "Face palm loading...",
    "Should I start preparing my victory dance?",
    "Time's ticking...",
    "Better luck next time!"
  ];

  const victoryMessages = [
    "Well, well... looks like you've got some brain cells after all!",
    "I demand a rematch!",
    "You got lucky this time...",
  ];

  useEffect(() => {
    if (wrongGuesses > 0 && wrongGuesses <= maxGuesses) {
      setMessage(wrongGuessMessages[wrongGuesses - 1]);
      setShowSpeechBubble(true);
      const timer = setTimeout(() => setShowSpeechBubble(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [wrongGuesses]);

  useEffect(() => {
    if (isGameOver) {
      setMessage(
        gameWon 
          ? victoryMessages[Math.floor(Math.random() * victoryMessages.length)]
          : "Game over! I knew you couldn't handle my intellectual superiority!"
      );
      setShowSpeechBubble(true);
      
      const timer = setTimeout(() => setShowSpeechBubble(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, gameWon]);

  const parts = [];
  for (let i = 1; i <= wrongGuesses; i++) {
    switch(i) {
      case 1:
        parts.push("head");
        break;
      case 2:
        parts.push("body");
        break;
      case 3:
        parts.push("leftArm");
        break;
      case 4:
        parts.push("rightArm");
        break;
      case 5:
        parts.push("leftLeg");
        break;
      case 6:
        parts.push("rightLeg");
        break;
    }
  }

  return (
    <div className={cn("relative w-[300px] h-[300px]", className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <AnimatePresence>
          {parts.map((part, index) => (
            <AvatarPart
              key={part}
              type={part as any}
              className="absolute"
              style={{
                ...getPositionStyle(part as any),
                zIndex: index
              }}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {showSpeechBubble && message && (
            <SpeechBubble
              message={message}
              className="absolute -top-16 left-1/2 transform -translate-x-1/2"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const getPositionStyle = (part: string): React.CSSProperties => {
  switch(part) {
    case "head":
      return { top: "20%" };
    case "body":
      return { top: "45%" };
    case "leftArm":
      return { top: "45%", left: "35%" };
    case "rightArm":
      return { top: "45%", right: "35%" };
    case "leftLeg":
      return { bottom: "20%", left: "45%" };
    case "rightLeg":
      return { bottom: "20%", right: "45%" };
    default:
      return {};
  }
};
