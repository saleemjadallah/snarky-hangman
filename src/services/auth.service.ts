
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

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  
  // Ensure all required fields are present with default values if needed
  if (data) {
    return {
      id: data.id,
      username: data.username,
      email: data.email,
      avatar_url: data.avatar_url || null,
      total_score: data.total_score || 0,
      best_score: data.best_score || 0,
      perfect_games: data.perfect_games || 0,
      current_streak: data.current_streak || 0,
      longest_streak: data.longest_streak || 0,
      easy_games_played: data.easy_games_played || 0,
      medium_games_played: data.medium_games_played || 0,
      hard_games_played: data.hard_games_played || 0,
      last_played_at: data.last_played_at || null,
      last_streak_update: data.last_streak_update || null,
      created_at: data.created_at,
      daily_score: data.daily_score,
      favorite_difficulty: data.favorite_difficulty,
      hints_used: data.hints_used,
      updated_at: data.updated_at,
      weekly_score: data.weekly_score
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
