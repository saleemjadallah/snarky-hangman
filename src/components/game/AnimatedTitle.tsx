
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const snarkySubtitles = [
  "Where vocabulary goes to die",
  "Making English teachers cry since 2025",
  "Because crosswords are too easy",
  "Your spell-check can't save you now",
  "Autocorrect this, genius",
  "PhD in mockery, BA in vocabulary",
  "Where words fear to tread",
  "Spelling bee dropouts welcome",
  "Dictionary? Where we're going, we don't need dictionaries",
  "Less forgiving than your grammar teacher"
];

const letterVariants = {
  hover: (i: number) => ({
    y: i % 2 === 0 ? -5 : 5,
    rotate: i % 2 === 0 ? -5 : 5,
    scale: 1.1,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 300
    }
  }),
  initial: { y: 0, rotate: 0, scale: 1 }
};

export const AnimatedTitle = () => {
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const title = "Snarky Hangman";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtitle((prev) => (prev + 1) % snarkySubtitles.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center space-y-4">
      <h1 className="relative inline-block">
        <div className="flex justify-center overflow-hidden">
          {title.split("").map((letter, i) => (
            <motion.span
              key={i}
              className={cn(
                "inline-block font-black text-primary select-none cursor-default",
                "text-[28px] sm:text-[36px] md:text-[48px]",
                "transition-colors duration-300",
                "hover:text-secondary"
              )}
              variants={letterVariants}
              initial="initial"
              whileHover="hover"
              custom={i}
              style={{ 
                letterSpacing: "0.02em",
                transformOrigin: "50% 50%"
              }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </div>
      </h1>

      {/* Animated Subtitle */}
      <div className="h-[2em] relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentSubtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "absolute w-full",
              "font-medium italic text-muted-foreground",
              "text-base sm:text-lg md:text-2xl"
            )}
          >
            {snarkySubtitles[currentSubtitle]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};
