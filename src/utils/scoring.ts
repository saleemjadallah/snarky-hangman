
import { Difficulty, difficultySettings } from "@/lib/game-data";

export const calculateScore = (
  guessed: string[], 
  word: string, 
  difficulty: Difficulty, 
  hintsUsed: number,
  timeRemaining: number
) => {
  const uniqueLetters = new Set(word).size;
  const wrongGuesses = guessed.filter(letter => !word.includes(letter)).length;
  const baseScore = uniqueLetters * difficultySettings[difficulty].pointsPerLetter;
  const hintPenalty = hintsUsed * difficultySettings[difficulty].hintCost;
  const timeBonus = Math.floor(timeRemaining / 10) * 5;
  return Math.max(0, baseScore - (wrongGuesses * 5) - hintPenalty + timeBonus);
};

export const getMaxTimeForDifficulty = (diff: Difficulty) => {
  switch (diff) {
    case "easy": return 120;
    case "medium": return 150;
    case "hard": return 210;
  }
};
