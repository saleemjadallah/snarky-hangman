
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

  const fetchProfile = async (userId: string) => {
    try {
      const data = await AuthService.fetchProfile(userId);
      if (data) {
        console.log("Profile fetched:", data); // Debug log
        setProfile(data);
      }
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
    AuthService.getCurrentSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(async (session) => {
      console.log("Auth state changed:", session);
      
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
      const isUsernameAvailable = await AuthService.checkUsernameAvailability(username);
      if (!isUsernameAvailable) {
        throw new Error("Username already taken");
      }

      const { data, error } = await AuthService.createTestSession(email);
      if (error) {
        // Check if the error indicates the email already exists
        if (error.message?.includes('already exists')) {
          throw new Error("This email is already registered. Please sign in instead.");
        }
        throw error;
      }

      // Wait a moment for the trigger to create the profile
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Fetch the session to get the user
      const { data: { session } } = await AuthService.getCurrentSession();
      if (session?.user) {
        await AuthService.updateUsername(session.user.id, username);
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
      const { error } = await AuthService.createTestSession(email);
      if (error) throw error;

      // Wait a moment for the session to be created
      await new Promise(resolve => setTimeout(resolve, 1000));

      const { data: { session } } = await AuthService.getCurrentSession();
      if (session?.user) {
        console.log("Sign in successful, fetching profile for user:", session.user.id);
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
      const { error } = await AuthService.signOutUser();
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
