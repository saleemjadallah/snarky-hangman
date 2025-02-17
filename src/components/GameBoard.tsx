
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Difficulty, Word, snarkyComments, difficultySettings } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "./avatar/Avatar";

interface GameBoardProps {
  currentWord: Word;
  difficulty: Difficulty;
  onGameEnd: (won: boolean, score: number) => void;
}

interface WordCache {
  easy?: Word[];
  medium?: Word[];
  hard?: Word[];
}

const CACHE_KEY = 'word_cache';
const MIN_CACHE_THRESHOLD = 5;

const getWordCache = (): WordCache => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
};

const setWordCache = (cache: WordCache) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const GameBoard = ({ currentWord, difficulty, onGameEnd }: GameBoardProps) => {
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [remainingGuesses, setRemainingGuesses] = useState(difficultySettings[difficulty].maxGuesses);
  const [message, setMessage] = useState("");
  const [isGameFinished, setIsGameFinished] = useState(false);
  const { toast } = useToast();

  const word = currentWord.word.toUpperCase();
  const category = currentWord.category;
  const wrongGuesses = difficultySettings[difficulty].maxGuesses - remainingGuesses;
  const isGameOver = remainingGuesses === 0 || word.split("").every((letter) => guessedLetters.includes(letter));
  const gameWon = word.split("").every((letter) => guessedLetters.includes(letter));

  useEffect(() => {
    // Reset state when a new word is received
    setGuessedLetters([]);
    setRemainingGuesses(difficultySettings[difficulty].maxGuesses);
    setMessage("");
    setIsGameFinished(false);
  }, [currentWord, difficulty]);

  useEffect(() => {
    if (isGameOver && !isGameFinished) {
      setIsGameFinished(true);
      const score = gameWon ? calculateScore(guessedLetters, word) : 0;
      
      setTimeout(() => {
        onGameEnd(gameWon, score);
      }, 2000); // Give time for the avatar animation to play
    }
  }, [isGameOver, isGameFinished]);

  const calculateScore = (guessed: string[], word: string) => {
    const uniqueLetters = new Set(word).size;
    const wrongGuesses = guessed.filter(letter => !word.includes(letter)).length;
    const baseScore = uniqueLetters * difficultySettings[difficulty].pointsPerLetter;
    return Math.max(0, baseScore - (wrongGuesses * 5));
  };

  const maskWord = (word: string) => {
    return word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  const handleGuess = (letter: string) => {
    if (isGameOver || guessedLetters.includes(letter)) {
      return;
    }

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      const newRemainingGuesses = remainingGuesses - 1;
      setRemainingGuesses(newRemainingGuesses);
      
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
      const comment = snarkyComments.goodGuess[Math.floor(Math.random() * snarkyComments.goodGuess.length)];
      setMessage(comment);

      // Check if this guess wins the game
      if (word.split("").every(l => newGuessedLetters.includes(l))) {
        const winComment = snarkyComments.win[Math.floor(Math.random() * snarkyComments.win.length)];
        const score = calculateScore(newGuessedLetters, word);
        toast({
          title: "You Won!",
          description: `${winComment} Score: ${score}`,
        });
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 glass rounded-xl space-y-8">
      <div className="space-y-4">
        <Badge variant="outline" className="text-sm">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
        <div className="flex items-center justify-between gap-8">
          <div className="text-4xl font-bold tracking-wider text-primary">
            {maskWord(word)}
          </div>
          <Avatar
            wrongGuesses={wrongGuesses}
            maxGuesses={difficultySettings[difficulty].maxGuesses}
            gameWon={gameWon}
            isGameOver={isGameOver}
            className="hidden md:block"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Remaining Guesses: {remainingGuesses}
        </div>
        {message && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <MessageCircle size={16} />
            {message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
        {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
          <Button
            key={letter}
            variant={guessedLetters.includes(letter) ? "secondary" : "outline"}
            className={`w-10 h-10 ${
              guessedLetters.includes(letter) ? "opacity-50" : "btn-hover"
            }`}
            disabled={guessedLetters.includes(letter) || isGameOver}
            onClick={() => handleGuess(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>

      <Avatar
        wrongGuesses={wrongGuesses}
        maxGuesses={difficultySettings[difficulty].maxGuesses}
        gameWon={gameWon}
        isGameOver={isGameOver}
        className="md:hidden mt-4"
      />
    </div>
  );
};
