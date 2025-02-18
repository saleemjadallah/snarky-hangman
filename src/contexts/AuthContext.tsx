
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { AuthContextType, Profile } from "@/types/auth";
import * as AuthService from "@/services/auth.service";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guestName, setGuestName] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check initial session
    AuthService.getCurrentSession().then(({ data: { session }}) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        AuthService.fetchProfile(session.user.id)
          .then(profile => setProfile(profile));
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription }} = AuthService.onAuthStateChange((session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        AuthService.fetchProfile(session.user.id)
          .then(profile => setProfile(profile));
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, username: string) => {
    setIsLoading(true);
    try {
      const response = await AuthService.signUp(email, username);
      if (response.error) throw response.error;
      
      toast({
        title: "Magic link sent!",
        description: "Please check your email to sign in.",
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
      const response = await AuthService.signIn(email);
      if (response.error) throw response.error;

      toast({
        title: "Magic link sent!",
        description: "Please check your email to sign in.",
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
    try {
      await AuthService.signOut();
      setUser(null);
      setProfile(null);
      setGuestName(null);
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
    } catch (error: any) {
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
      guestName,
      setProfile
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
