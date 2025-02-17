
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
  return data;
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
