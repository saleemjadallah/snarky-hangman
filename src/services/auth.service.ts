
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { AuthResponse } from "@supabase/supabase-js";

export async function signUp(email: string, username: string): Promise<AuthResponse> {
  try {
    const response = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          username // Store username in user metadata
        },
        emailRedirectTo: `${window.location.origin}/` // Ensure redirect happens to the correct URL with trailing slash
      }
    });

    if (response.error) throw response.error;
    return response;
  } catch (error: any) {
    throw error;
  }
}

export async function signIn(email: string): Promise<AuthResponse> {
  const response = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/` // Ensure redirect happens to the correct URL with trailing slash
    }
  });

  if (response.error) throw response.error;
  return response;
}

interface DatabaseProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string | null;
  total_score?: number;
  best_score?: number;
  perfect_games?: number;
  current_streak?: number;
  longest_streak?: number;
  easy_games_played?: number;
  medium_games_played?: number;
  hard_games_played?: number;
  last_played_at?: string | null;
  last_streak_update?: string | null;
  created_at?: string;
  daily_score?: number;
  favorite_difficulty?: string;
  hints_used?: number;
  updated_at?: string;
  weekly_score?: number;
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  
  // Ensure all required fields are present with default values if needed
  if (data) {
    const dbProfile = data as DatabaseProfile;
    return {
      id: dbProfile.id,
      username: dbProfile.username,
      email: dbProfile.email,
      avatar_url: dbProfile.avatar_url || null,
      total_score: dbProfile.total_score || 0,
      best_score: dbProfile.best_score || 0,
      perfect_games: dbProfile.perfect_games || 0,
      current_streak: dbProfile.current_streak || 0,
      longest_streak: dbProfile.longest_streak || 0,
      easy_games_played: dbProfile.easy_games_played || 0,
      medium_games_played: dbProfile.medium_games_played || 0,
      hard_games_played: dbProfile.hard_games_played || 0,
      last_played_at: dbProfile.last_played_at || null,
      last_streak_update: dbProfile.last_streak_update || null,
      created_at: dbProfile.created_at,
      daily_score: dbProfile.daily_score,
      favorite_difficulty: dbProfile.favorite_difficulty,
      hints_used: dbProfile.hints_used,
      updated_at: dbProfile.updated_at,
      weekly_score: dbProfile.weekly_score
    };
  }
  
  return null;
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentSession() {
  return await supabase.auth.getSession();
}

export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log("Auth state changed:", { event, session });
    callback(session);
  });
}
