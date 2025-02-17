
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;
      if (data) setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error fetching profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, username: string) => {
    setIsLoading(true);
    try {
      // First check if username is taken
      const { data: existingUsers, error: searchError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingUsers) {
        throw new Error("Username already taken");
      }

      // Create the user session
      const { data, error } = await supabase.rpc('create_test_session', {
        user_email: email
      });

      if (error) throw error;

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch the session to get the user
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Update the username in the profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ username })
          .eq('id', session.user.id);

        if (updateError) throw updateError;

        await fetchProfile(session.user.id);
      }

      toast({
        title: "Welcome aboard!",
        description: "You're now signed in and ready to play!",
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('create_test_session', {
        user_email: email
      });

      if (error) throw error;

      // Wait a moment for the session to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch the session to get the user
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      
      toast({
        title: "Welcome back!",
        description: "You're now signed in and ready to play!",
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setGuestName(null);
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    setGuestName,
    isGuest: !user && !!guestName,
    guestName
  };

  console.log("Auth context state:", {
    user: !!user,
    profile: !!profile,
    isLoading,
    isGuest: !user && !!guestName
  });

  return (
    <AuthContext.Provider value={contextValue}>
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
