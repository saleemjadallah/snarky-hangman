
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AvatarPartProps {
  type: "head" | "body" | "leftArm" | "rightArm" | "leftLeg" | "rightLeg";
  className?: string;
  style?: React.CSSProperties;
}

export const AvatarPart = ({ type, className, style }: AvatarPartProps) => {
  const variants = {
    head: {
      initial: { opacity: 0, scale: 0.5, y: -20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.5, y: -20 }
    },
    body: {
      initial: { opacity: 0, scaleY: 0 },
      animate: { opacity: 1, scaleY: 1 },
      exit: { opacity: 0, scaleY: 0 }
    },
    leftArm: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    },
    rightArm: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    leftLeg: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    },
    rightLeg: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 }
    }
  };

  const parts = {
    head: "🤖",
    body: "👕",
    leftArm: "💪",
    rightArm: "💪",
    leftLeg: "🦿",
    rightLeg: "🦿"
  };

  return (
    <motion.div
      variants={variants[type]}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn("text-4xl", className)}
      style={style}
    >
      {parts[type]}
    </motion.div>
  );
};
