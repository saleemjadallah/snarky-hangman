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
  const { user, profile, isGuest, guestName, signOut, setProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user && !isGuest && !isLoading) {
      setShowRegistration(true);
    } else {
      setShowRegistration(false);
    }
  }, [user, isGuest, isLoading]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('profile-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        async (payload) => {
          const { data: updatedProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (updatedProfile) {
            setProfile(updatedProfile);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const getRandomWord = async (difficulty: Difficulty) => {
    try {
      const categories = ['animals', 'science', 'arts', 'sports', 'food', 'geography', 'business', 'health'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      await supabase.functions.invoke('generate-words', {
        body: { difficulty, category: randomCategory }
      });

      const { count } = await supabase
        .from('word_pool')
        .select('*', { count: 'exact', head: true })
        .eq('difficulty', difficulty)
        .eq('category', randomCategory)
        .eq('active', true);

      const randomOffset = Math.floor(Math.random() * (count || 1));

      const { data: words, error } = await supabase
        .from('word_pool')
        .select('word, difficulty, category')
        .eq('difficulty', difficulty)
        .eq('category', randomCategory)
        .eq('active', true)
        .order('times_used', { ascending: true })
        .order('last_used_at', { ascending: true, nullsFirst: true })
        .limit(1)
        .range(randomOffset, randomOffset);

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

  const handleGameEnd = async (won: boolean, gameScore: number) => {
    if (!user && !isGuest) return;

    try {
      const { error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: user?.id,
          difficulty: difficulty,
          word_category: currentWord?.category,
          score: gameScore,
          wrong_guesses: won ? 0 : 6,
          perfect_game: won,
          abandoned: !won
        });

      if (sessionError) throw sessionError;

      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (fetchError) throw fetchError;

      const difficultyColumn = `${difficulty}_games_played`;
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          [difficultyColumn]: (currentProfile?.[difficultyColumn] || 0) + 1,
          total_score: (currentProfile?.total_score || 0) + (won ? gameScore : 0),
          best_score: won ? Math.max(currentProfile?.best_score || 0, gameScore) : currentProfile?.best_score || 0,
          perfect_games: currentProfile?.perfect_games + (won ? 1 : 0),
          current_streak: won ? (currentProfile?.current_streak || 0) + 1 : 0,
          longest_streak: won ? 
            Math.max(currentProfile?.longest_streak || 0, (currentProfile?.current_streak || 0) + 1) : 
            currentProfile?.longest_streak || 0,
          last_played_at: new Date().toISOString(),
          last_streak_update: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      if (won) {
        setScore((prev) => prev + gameScore);
      }

      setCurrentWord(null);
      setDifficulty(null);

      await supabase.rpc('maintain_word_pools');
    } catch (error) {
      console.error('Error updating game stats:', error);
      toast({
        title: "Error",
        description: "Failed to update game statistics.",
        variant: "destructive"
      });
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
            <div className="flex flex-col items-center gap-4">
              {isLoading ? (
                <Button disabled className="btn-hover" size="lg">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handlePlayAgain}
                    className="btn-hover"
                    size="lg"
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    Play Again (Same Difficulty)
                  </Button>
                  <Button
                    onClick={() => setDifficulty(null)}
                    variant="outline"
                    size="lg"
                  >
                    Change Difficulty
                  </Button>
                </>
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
