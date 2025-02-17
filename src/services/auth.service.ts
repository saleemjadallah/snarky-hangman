
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";

export async function signUp(email: string, username: string) {
  // First create the actual user account
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password: email, // For demo purposes, using email as password. In production, you'd want a proper password field
    options: {
      data: {
        username: username // Store username in user metadata
      }
    }
  });

  if (signUpError) throw signUpError;
  if (!authData.user) throw new Error('No user data returned');

  // The profile will be created automatically by our database trigger
  console.log("User created:", authData);

  return { session: authData.session };
}

export async function signIn(email: string) {
  const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: email // For demo purposes, using email as password
  });

  if (signInError) throw signInError;
  if (!authData.session) throw new Error('No session established');

  return { session: authData.session };
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
