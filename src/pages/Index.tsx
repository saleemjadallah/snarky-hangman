import { useState, useEffect } from "react";
import { GameBoard } from "@/components/GameBoard";
import { DifficultySelector } from "@/components/DifficultySelector";
import { type Difficulty, type Word } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { RotateCw, LogOut } from "lucide-react";
import { Logo } from "@/components/Logo";
import { RegistrationModal } from "@/components/RegistrationModal";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileMenu } from "@/components/ProfileMenu";
import { Leaderboard } from "@/components/Leaderboard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [showRegistration, setShowRegistration] = useState(false);
  const { user, profile, isGuest, guestName, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isGuest) {
      setShowRegistration(true);
    }
  }, [user, isGuest]);

  const getRandomWord = async (difficulty: Difficulty) => {
    try {
      const categories = ['animals', 'science', 'arts', 'sports', 'food', 'geography', 'business', 'health'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      await supabase.functions.invoke('generate-words', {
        body: { difficulty, category: randomCategory }
      });

      const { data: words, error } = await supabase
        .from('word_pool')
        .select('word, difficulty, category')
        .eq('difficulty', difficulty)
        .eq('category', randomCategory)
        .eq('active', true)
        .order('times_used', { ascending: true })
        .limit(1);

      if (error) {
        throw error;
      }

      if (!words || words.length === 0) {
        throw new Error('No words available');
      }

      return words[0] as Word;
    } catch (error) {
      console.error('Error fetching word:', error);
      toast({
        title: "Error",
        description: "Failed to fetch a word. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleDifficultySelect = async (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    const word = await getRandomWord(selectedDifficulty);
    if (word) {
      setCurrentWord(word);
    }
  };

  const handleGameEnd = async (won: boolean, gameScore: number) => {
    if (won) {
      setScore((prev) => prev + gameScore);
    }
    setCurrentWord(null);
  };

  const handlePlayAgain = async () => {
    if (difficulty) {
      const word = await getRandomWord(difficulty);
      if (word) {
        setCurrentWord(word);
      }
    }
  };

  const displayName = profile?.username || guestName || "Player";

  return (
    <div className="min-h-screen w-full">
      <div className="absolute top-4 left-4">
        <Logo />
      </div>
      
      {(user || isGuest) && (
        <div className="absolute top-4 right-4 flex items-center gap-4">
          {user && <Leaderboard />}
          <span className="text-sm font-medium">
            {isGuest ? `Playing as guest: ${displayName}` : `Welcome, ${displayName}!`}
          </span>
          {user ? (
            <ProfileMenu />
          ) : (
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      )}
      
      <div className="px-4 py-8 space-y-8">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-primary">Snarky Hangman</h1>
          <p className="text-muted-foreground">
            Can you outsmart the world's most condescending word game?
          </p>
          {score > 0 && (
            <p className="text-lg font-semibold text-secondary">Score: {score}</p>
          )}
        </div>

        <div className="max-w-[600px] mx-auto px-6 text-center space-y-4 animate-fade-in">
          <p className="text-[#2D3748] leading-relaxed text-base sm:text-lg">
            Think you're a wordsmith? Put your vocabulary to the test against our sarcastically superior AI. Fair warning: our AI has devoured dictionaries for breakfast and takes peculiar joy in watching humans squirm. Choose your difficulty level, pick your avatar, and prepare to be lovingly mocked for every wrong guess. Don't worry though – even if you lose, you'll at least get a good laugh out of it.
          </p>
          <p className="text-[#2D3748] font-medium text-base sm:text-lg">
            Ready to prove you're smarter than a particularly smug algorithm?
          </p>
        </div>

        {!difficulty && <DifficultySelector onSelect={handleDifficultySelect} />}

        {difficulty && !currentWord && (
          <div className="flex justify-center">
            <Button
              onClick={handlePlayAgain}
              className="btn-hover"
              size="lg"
            >
              <RotateCw className="mr-2 h-4 w-4" />
              Play Again
            </Button>
          </div>
        )}

        {currentWord && (
          <GameBoard
            currentWord={currentWord}
            difficulty={difficulty}
            onGameEnd={handleGameEnd}
          />
        )}
      </div>

      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
      />
    </div>
  );
}

export default Index;
