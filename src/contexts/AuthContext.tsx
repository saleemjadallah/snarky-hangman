
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, username: string) => Promise<void>;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  setGuestName: (name: string) => void;
  isGuest: boolean;
  guestName: string | null;
}

interface Profile {
  username: string;
  email: string;
  total_score: number;
  best_score: number;
  last_played_at: string | null;
  easy_games_played: number;
  medium_games_played: number;
  hard_games_played: number;
  current_streak: number;
  longest_streak: number;
  perfect_games: number;
  hints_used: number;
  favorite_difficulty: string | null;
  weekly_score: number;
  daily_score: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestName, setGuestName] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching profile:', error);
            } else {
              setProfile(data);
            }
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } else {
          setProfile(data);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, username: string) => {
    try {
      console.log("Starting signup process for:", { email, username });
      
      const { data: existingUsers, error: searchError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        console.error("Error checking existing username:", searchError);
        throw new Error("Error checking username availability");
      }

      if (existingUsers) {
        throw new Error("Username already taken");
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password: crypto.randomUUID(),
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        throw error;
      }

      console.log("Signup successful:", data);
      
      toast({
        title: "Welcome aboard!",
        description: "Check your email for the magic link to start playing!",
      });
    } catch (error: any) {
      console.error("Signup process error:", error);
      toast({
        title: "Oops! Something went wrong",
        description: error.message || "Error creating account",
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
      });

      if (error) throw error;
      
      toast({
        title: "Magic link sent!",
        description: "Check your email to sign in and start playing!",
      });
    } catch (error: any) {
      toast({
        title: "Oops! Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      signUp,
      signIn,
      signOut,
      setGuestName,
      isGuest: !user && !!guestName,
      guestName
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
