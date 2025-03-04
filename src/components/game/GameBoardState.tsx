
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Difficulty, Word, snarkyComments, difficultySettings } from "@/lib/game-data";
import { calculateScore, getMaxTimeForDifficulty } from "@/utils/scoring";

interface UseGameBoardStateProps {
  currentWord: Word;
  difficulty: Difficulty;
  onGameEnd: (won: boolean, score: number) => void;
}

export const useGameBoardState = ({ 
  currentWord, 
  difficulty, 
  onGameEnd 
}: UseGameBoardStateProps) => {
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [remainingGuesses, setRemainingGuesses] = useState(difficultySettings[difficulty].maxGuesses);
  const [message, setMessage] = useState("");
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(() => {
    switch (difficulty) {
      case "easy": return 90;
      case "medium": return 120;
      case "hard": return 180;
    }
  });
  const { toast } = useToast();

  const word = currentWord.word.toUpperCase();
  const category = currentWord.category;
  const wrongGuesses = difficultySettings[difficulty].maxGuesses - remainingGuesses;
  const isGameOver = remainingGuesses === 0 || timeRemaining <= 0 || word.split("").every((letter) => guessedLetters.includes(letter));
  const gameWon = word.split("").every((letter) => guessedLetters.includes(letter));

  useEffect(() => {
    setGuessedLetters([]);
    setRemainingGuesses(difficultySettings[difficulty].maxGuesses);
    setMessage("");
    setIsGameFinished(false);
    setHintsUsed(0);
    setGameScore(0);
    setTimeRemaining(() => {
      switch (difficulty) {
        case "easy": return 90;
        case "medium": return 120;
        case "hard": return 180;
      }
    });
  }, [currentWord, difficulty]);

  useEffect(() => {
    if (isGameOver && !isGameFinished) {
      setIsGameFinished(true);
      const score = gameWon ? calculateScore(guessedLetters, word, difficulty, hintsUsed, timeRemaining) : 0;
      setGameScore(score);
      
      // Call onGameEnd for both win and lose conditions
      onGameEnd(gameWon, score);
    }
  }, [isGameOver, isGameFinished]);

  const handleGuess = (letter: string) => {
    if (isGameOver || guessedLetters.includes(letter)) {
      return;
    }

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newRemainingGuesses = remainingGuesses - 1;
      setRemainingGuesses(newRemainingGuesses);
      
      // Apply time penalty
      setTimeRemaining(prev => Math.max(30, prev - 5));
      const comment = snarkyComments.badGuess[Math.floor(Math.random() * snarkyComments.badGuess.length)];
      setMessage(comment);

      if (newRemainingGuesses === 0) {
        const loseComment = snarkyComments.lose[Math.floor(Math.random() * snarkyComments.lose.length)];
        toast({
          title: "Game Over!",
          description: loseComment,
          variant: "destructive",
        });
      }
    } else {
      // Add bonus time for correct guess
      setTimeRemaining(prev => Math.min(prev + 10, getMaxTimeForDifficulty(difficulty)));
      const comment = snarkyComments.goodGuess[Math.floor(Math.random() * snarkyComments.goodGuess.length)];
      setMessage(comment);

      if (word.split("").every(l => newGuessedLetters.includes(l))) {
        const winComment = snarkyComments.win[Math.floor(Math.random() * snarkyComments.win.length)];
        const score = calculateScore(newGuessedLetters, word, difficulty, hintsUsed, timeRemaining);
        toast({
          title: "You Won!",
          description: `${winComment} Score: ${score}`,
        });
      }
    }
  };

  const handleHintUsed = () => {
    setHintsUsed(prev => prev + 1);
    // Add bonus time for using a hint
    setTimeRemaining(prev => Math.min(prev + 5, getMaxTimeForDifficulty(difficulty)));
  };

  return {
    guessedLetters,
    remainingGuesses,
    message,
    isGameFinished,
    hintsUsed,
    gameScore,
    timeRemaining,
    word,
    category,
    wrongGuesses,
    isGameOver,
    gameWon,
    handleGuess,
    handleHintUsed,
    setTimeRemaining
  };
};
