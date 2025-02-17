
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpeechBubble } from "./SpeechBubble";
import { AvatarPart } from "./AvatarPart";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";

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
  }, [wrongGuesses, maxGuesses]);

  useEffect(() => {
    if (isGameOver) {
      setMessage(
        gameWon 
          ? victoryMessages[Math.floor(Math.random() * victoryMessages.length)]
          : "Game over! I knew you couldn't handle my intellectual superiority!"
      );
      setShowSpeechBubble(true);
    }
  }, [isGameOver, gameWon]);

  return (
    <div className={cn("relative w-[300px] h-[300px]", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full h-full"
      >
        {/* Base avatar container */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence>
            {/* Head */}
            {wrongGuesses >= 1 && (
              <AvatarPart
                type="head"
                className="absolute"
                style={{ top: "20%" }}
              />
            )}
            
            {/* Body */}
            {wrongGuesses >= 2 && (
              <AvatarPart
                type="body"
                className="absolute"
                style={{ top: "45%" }}
              />
            )}
            
            {/* Left Arm */}
            {wrongGuesses >= 3 && (
              <AvatarPart
                type="leftArm"
                className="absolute"
                style={{ top: "45%", left: "35%" }}
              />
            )}
            
            {/* Right Arm */}
            {wrongGuesses >= 4 && (
              <AvatarPart
                type="rightArm"
                className="absolute"
                style={{ top: "45%", right: "35%" }}
              />
            )}
            
            {/* Left Leg */}
            {wrongGuesses >= 5 && (
              <AvatarPart
                type="leftLeg"
                className="absolute"
                style={{ bottom: "20%", left: "45%" }}
              />
            )}
            
            {/* Right Leg */}
            {wrongGuesses >= 6 && (
              <AvatarPart
                type="rightLeg"
                className="absolute"
                style={{ bottom: "20%", right: "45%" }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Speech Bubble */}
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
