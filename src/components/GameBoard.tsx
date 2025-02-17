
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Difficulty, Word, snarkyComments, difficultySettings } from "@/lib/game-data";
import { Avatar } from "./avatar/Avatar";
import { WordDisplay } from "./game/WordDisplay";
import { GameStatus } from "./game/GameStatus";
import { LetterGrid } from "./game/LetterGrid";

interface GameBoardProps {
  currentWord: Word;
  difficulty: Difficulty;
  onGameEnd: (won: boolean, score: number) => void;
}

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
      }, 2000);
    }
  }, [isGameOver, isGameFinished]);

  const calculateScore = (guessed: string[], word: string) => {
    const uniqueLetters = new Set(word).size;
    const wrongGuesses = guessed.filter(letter => !word.includes(letter)).length;
    const baseScore = uniqueLetters * difficultySettings[difficulty].pointsPerLetter;
    return Math.max(0, baseScore - (wrongGuesses * 5));
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
      <WordDisplay
        word={word}
        category={category}
        guessedLetters={guessedLetters}
        wrongGuesses={wrongGuesses}
        difficulty={difficulty}
        gameWon={gameWon}
        isGameOver={isGameOver}
      />

      <GameStatus
        remainingGuesses={remainingGuesses}
        message={message}
      />

      <LetterGrid
        guessedLetters={guessedLetters}
        isGameOver={isGameOver}
        onGuess={handleGuess}
      />

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
