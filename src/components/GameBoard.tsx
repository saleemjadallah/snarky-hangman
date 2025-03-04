
import { Difficulty, Word } from "@/lib/game-data";
import { difficultySettings } from "@/lib/game-data";
import { Avatar } from "./avatar/Avatar";
import { WordDisplay } from "./game/WordDisplay";
import { GameStatus } from "./game/GameStatus";
import { LetterGrid } from "./game/LetterGrid";
import { HintSystem } from "./game/HintSystem";
import { GameControls } from "./game/GameControls";
import { GameBoardHeader } from "./game/GameBoardHeader";
import { useGameBoardState } from "./game/GameBoardState";
import { calculateScore } from "@/utils/scoring";

interface GameBoardProps {
  currentWord: Word;
  difficulty: Difficulty;
  onGameEnd: (won: boolean, score: number) => void;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  isLoading?: boolean;
}

export const GameBoard = ({ 
  currentWord, 
  difficulty, 
  onGameEnd,
  onPlayAgain,
  onChangeDifficulty,
  isLoading = false
}: GameBoardProps) => {
  const {
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
  } = useGameBoardState({
    currentWord,
    difficulty,
    onGameEnd
  });

  const gameStats = isGameFinished && gameWon ? {
    word,
    score: calculateScore(guessedLetters, word, difficulty, hintsUsed, timeRemaining),
    difficulty,
    timeRemaining,
    hintsUsed
  } : undefined;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 glass rounded-xl space-y-8">
      <GameBoardHeader
        timeRemaining={timeRemaining}
        isGameFinished={isGameFinished}
        isGameOver={isGameOver}
        onTimeUpdate={setTimeRemaining}
        difficulty={difficulty}
        gameWon={gameWon}
        gameScore={gameScore}
      />

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

      <HintSystem
        difficulty={difficulty}
        word={word}
        category={category}
        guessedLetters={guessedLetters}
        onHintUsed={handleHintUsed}
      />

      <LetterGrid
        guessedLetters={guessedLetters}
        isGameOver={isGameOver}
        onGuess={handleGuess}
      />

      {isGameFinished && (
        <GameControls
          isLoading={isLoading}
          onPlayAgain={onPlayAgain}
          onChangeDifficulty={onChangeDifficulty}
          showChallenge={gameWon}
          gameStats={gameStats}
        />
      )}

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
