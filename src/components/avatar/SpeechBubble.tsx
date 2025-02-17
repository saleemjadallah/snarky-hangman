
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeechBubbleProps {
  message: string;
  className?: string;
}

export const SpeechBubble = ({ message, className }: SpeechBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className={cn(
        "relative bg-white p-4 rounded-lg shadow-lg max-w-[200px]",
        className
      )}
    >
      <MessageCircle className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-white h-6 w-6" />
      <p className="text-sm font-medium text-gray-800 text-center">{message}</p>
    </motion.div>
  );
};
