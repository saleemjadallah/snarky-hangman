
import { Button } from "@/components/ui/button";
import { difficultySettings } from "@/lib/game-data";
import type { Difficulty } from "@/lib/game-data";
import { Brain, Coffee, GraduationCap } from "lucide-react";
import { motion, type TargetAndTransition } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

const difficultyMessages = {
  easy: {
    tooltip: "Don't worry, we'll use small words",
    selection: "Ah, playing it safe. How... predictable.",
    subtitle: "For those who struggle with 'Cat in the Hat'",
  },
  medium: {
    tooltip: "Feeling confident, are we?",
    selection: "Middle of the road? How adventurous.",
    subtitle: "Finally finished elementary school?",
  },
  hard: {
    tooltip: "Your funeral, champ",
    selection: "Bold choice. I'll prepare the tissues.",
    subtitle: "Oh, someone's feeling brave today!",
  },
};

const difficultyGradients = {
  easy: "bg-gradient-to-br from-blue-400 to-cyan-300 hover:from-blue-500 hover:to-cyan-400",
  medium: "bg-gradient-to-br from-orange-400 to-amber-300 hover:from-orange-500 hover:to-amber-400",
  hard: "bg-gradient-to-br from-red-400 to-rose-300 hover:from-red-500 hover:to-rose-400",
};

const difficultyTextColors = {
  easy: "text-blue-900",
  medium: "text-orange-900",
  hard: "text-red-900",
};

const DifficultyCard = ({ 
  difficulty, 
  onSelect,
  guesses,
  icon: Icon,
  borderColor,
  hoverAnimation,
  gradientClass,
  textColorClass
}: {
  difficulty: Difficulty;
  onSelect: () => void;
  guesses: number;
  icon: typeof Brain;
  borderColor: string;
  hoverAnimation: TargetAndTransition;
  gradientClass: string;
  textColorClass: string;
}) => {
  const { toast } = useToast();

  const handleSelect = () => {
    onSelect();
    toast({
      title: "Difficulty Selected",
      description: difficultyMessages[difficulty].selection,
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleSelect}
      className={`
        w-full min-h-[200px] p-6 
        flex flex-col items-center gap-4 
        font-poppins rounded-2xl
        border-2 transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
        cursor-pointer
        ${gradientClass}
        border-white/20 text-white
      `}
      asChild
    >
      <motion.div
        whileHover={hoverAnimation}
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex flex-col items-center gap-4 w-full">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-12 h-12 text-white" />
          </motion.div>

          <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold text-white">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h3>
            <p className="text-sm italic text-white/80">
              {difficultyMessages[difficulty].subtitle}
            </p>
            <p className="text-sm font-medium text-white">
              {guesses} guesses ({
                difficulty === "easy" ? "we'll be generous" :
                difficulty === "medium" ? "getting stingier" :
                "good luck with that"
              })
            </p>
          </div>
        </div>
      </motion.div>
    </Button>
  );
};

export const DifficultySelector = ({ onSelect }: DifficultySelectorProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-6 glass rounded-xl">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8 text-center font-poppins">
        Select Difficulty
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DifficultyCard
          difficulty="easy"
          onSelect={() => onSelect("easy")}
          guesses={difficultySettings.easy.maxGuesses}
          icon={Brain}
          borderColor="border-blue-100 hover:border-blue-300"
          hoverAnimation={{
            y: [0, -5, 0],
            transition: { duration: 1, repeat: Infinity }
          }}
          gradientClass={difficultyGradients.easy}
          textColorClass={difficultyTextColors.easy}
        />
        <DifficultyCard
          difficulty="medium"
          onSelect={() => onSelect("medium")}
          guesses={difficultySettings.medium.maxGuesses}
          icon={Coffee}
          borderColor="border-orange-100 hover:border-orange-300"
          hoverAnimation={{
            scale: 1.02,
            transition: { duration: 0.5 }
          }}
          gradientClass={difficultyGradients.medium}
          textColorClass={difficultyTextColors.medium}
        />
        <DifficultyCard
          difficulty="hard"
          onSelect={() => onSelect("hard")}
          guesses={difficultySettings.hard.maxGuesses}
          icon={GraduationCap}
          borderColor="border-red-100 hover:border-red-300"
          hoverAnimation={{
            x: [-2, 2, -2],
            transition: { duration: 0.3, repeat: Infinity }
          }}
          gradientClass={difficultyGradients.hard}
          textColorClass={difficultyTextColors.hard}
        />
      </div>
    </div>
  );
};
