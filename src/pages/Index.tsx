
import { useState, useEffect } from "react";
import { GameBoard } from "@/components/GameBoard";
import { DifficultySelector } from "@/components/DifficultySelector";
import { type Difficulty, type Word } from "@/lib/game-data";
import { Header } from "@/components/layout/Header";
import { IntroSection } from "@/components/game/IntroSection";
import { GameControls } from "@/components/game/GameControls";
import { RegistrationModal } from "@/components/RegistrationModal";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileSync } from "@/hooks/use-profile-sync";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [showRegistration, setShowRegistration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isGuest } = useAuth();
  const { toast } = useToast();

  // Use the profile sync hook
  useProfileSync();

  useEffect(() => {
    if (!user && !isGuest && !isLoading) {
      setShowRegistration(true);
    } else {
      setShowRegistration(false);
    }
  }, [user, isGuest, isLoading]);

  // Handle challenge parameter in URL
  useEffect(() => {
    const loadChallenge = async () => {
      const params = new URLSearchParams(window.location.search);
      const challengeId = params.get('challenge');
      
      if (challengeId) {
        try {
          setIsLoading(true);
          const { data: challenge, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('id', challengeId)
            .single();

          if (error) throw error;
          
          if (challenge) {
            setDifficulty(challenge.difficulty as Difficulty);
            setCurrentWord({
              word: challenge.word,
              category: 'challenge', // We might want to store category in challenges table
              difficulty: challenge.difficulty as Difficulty
            });
            
            // Clear the challenge ID from URL without refreshing
            window.history.replaceState({}, '', '/');
            
            toast({
              title: "Challenge Accepted!",
              description: "Show them what you've got!",
            });
          }
        } catch (error) {
          console.error('Error loading challenge:', error);
          toast({
            title: "Error loading challenge",
            description: "This challenge might have expired or been removed.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadChallenge();
  }, []);

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

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />

      <main className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <IntroSection score={score} />

          {!difficulty && <DifficultySelector onSelect={handleDifficultySelect} />}

          {difficulty && !currentWord && (
            <GameControls
              isLoading={isLoading}
              onPlayAgain={handlePlayAgain}
              onChangeDifficulty={() => setDifficulty(null)}
            />
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
