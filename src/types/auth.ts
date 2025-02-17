
import { User } from "@supabase/supabase-js";

export interface Profile {
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

export interface AuthContextType {
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
