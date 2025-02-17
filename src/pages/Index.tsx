import { useState, useEffect } from "react";
import { GameBoard } from "@/components/GameBoard";
import { DifficultySelector } from "@/components/DifficultySelector";
import { type Difficulty, type Word } from "@/lib/game-data";
import { Button } from "@/components/ui/button";
import { RotateCw, LogOut, Loader2 } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile, isGuest, guestName, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isGuest && !isLoading) {
      setShowRegistration(true);
    } else {
      setShowRegistration(false);
    }
  }, [user, isGuest, isLoading]);

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
    setIsLoading(true);
    const word = await getRandomWord(selectedDifficulty);
    setIsLoading(false);
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
      setIsLoading(true);
      const word = await getRandomWord(difficulty);
      setIsLoading(false);
      if (word) {
        setCurrentWord(word);
      }
    }
  };

  const displayName = profile?.username || guestName || "Player";

  return (
    <div className="min-h-screen w-full bg-background">
      <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-border z-50 px-4">
        <div className="max-w-7xl mx-auto h-full flex justify-between items-center">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative flex items-center">
              <Leaderboard />
            </div>
            <div className="relative flex items-center">
              <ProfileMenu />
            </div>
            {!user && isGuest && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">
                  Playing as guest: {displayName}
                </span>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
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
              {isLoading ? (
                <Button disabled className="btn-hover" size="lg">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </Button>
              ) : (
                <Button
                  onClick={handlePlayAgain}
                  className="btn-hover"
                  size="lg"
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  Play Again
                </Button>
              )}
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
      </main>

      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
      />
    </div>
  );
};

export default Index;
