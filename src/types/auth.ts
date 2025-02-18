
import { User } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  total_score: number;
  best_score: number;
  perfect_games: number;
  current_streak: number;
  longest_streak: number;
  easy_games_played: number;
  medium_games_played: number;
  hard_games_played: number;
  last_played_at: string | null;
  last_streak_update: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, username: string) => Promise<void>;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  setGuestName: (name: string | null) => void;
  isGuest: boolean;
  guestName: string | null;
  setProfile: (profile: Profile | null) => void;
}
