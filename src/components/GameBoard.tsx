import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Difficulty, Word, snarkyComments, difficultySettings } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GameBoardProps {
  currentWord: Word;
  difficulty: Difficulty;
  onGameEnd: (won: boolean, score: number) => void;
}

const CACHE_KEY = 'word_cache';
const MIN_CACHE_THRESHOLD = 5;

interface WordCache {
  [key in Difficulty]?: Word[];
}

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
  const { toast } = useToast();

  const word = currentWord.word.toUpperCase();
  const category = currentWord.category;

  useEffect(() => {
    const fetchWords = async () => {
      const cache = getWordCache();
      const wordsForDifficulty = cache[difficulty] || [];
      
      if (wordsForDifficulty.length <= MIN_CACHE_THRESHOLD) {
        try {
          const { data: newWords, error } = await supabase.functions.invoke('word-manager', {
            body: {
              difficulty,
              count: 10,
              excludeWords: wordsForDifficulty.map(w => w.word)
            }
          });

          if (error) throw error;

          cache[difficulty] = [...wordsForDifficulty, ...newWords];
          setWordCache(cache);
          
          console.log(`Cached ${newWords.length} new words for ${difficulty} difficulty`);
        } catch (error) {
          console.error('Failed to fetch words:', error);
        }
      }
    };

    fetchWords();
  }, [difficulty]);

  const maskWord = (word: string) => {
    return word
      .split("")
      .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
      .join(" ");
  };

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter)) {
      toast({
        title: "Already guessed!",
        description: "Try a different letter, Einstein.",
      });
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
        onGameEnd(false, 0);
      }
    } else {
      const comment = snarkyComments.goodGuess[Math.floor(Math.random() * snarkyComments.goodGuess.length)];
      setMessage(comment);

      const isWin = word.split("").every((letter) => newGuessedLetters.includes(letter));
      if (isWin) {
        const winComment = snarkyComments.win[Math.floor(Math.random() * snarkyComments.win.length)];
        const score = calculateScore(newGuessedLetters, word);
        toast({
          title: "You Won!",
          description: winComment,
        });
        onGameEnd(true, score);
      }
    }
  };

  const calculateScore = (guessed: string[], word: string) => {
    const uniqueLetters = new Set(word).size;
    const wrongGuesses = guessed.filter((letter) => !word.includes(letter)).length;
    return (uniqueLetters * difficultySettings[difficulty].pointsPerLetter) - (wrongGuesses * 5);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        handleGuess(letter);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [guessedLetters, word]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 glass rounded-xl space-y-8">
      <div className="space-y-4">
        <Badge variant="outline" className="text-sm">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
        <div className="text-4xl font-bold tracking-wider text-primary">
          {maskWord(word)}
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
            disabled={guessedLetters.includes(letter)}
            onClick={() => handleGuess(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );
};
