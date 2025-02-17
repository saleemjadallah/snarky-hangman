
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  console.log("Fetching profile for user:", userId);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
  console.log("Profile data received:", data);
  return data;
}

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle();

  if (error) throw error;
  return !data;
}

export async function updateUsername(userId: string, username: string): Promise<void> {
  console.log("Updating username:", { userId, username });
  const { error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', userId);

  if (error) throw error;
}

export async function createTestSession(email: string) {
  console.log("Creating test session for:", email);
  const { data, error } = await supabase.rpc('create_test_session', {
    user_email: email
  });
  
  if (error) throw error;
  
  // After creating the session, explicitly sign in the user
  return await supabase.auth.signInWithPassword({
    email: email,
    // Use a known password for test sessions
    password: 'test-session-password'
  });
}

export async function signOutUser() {
  return await supabase.auth.signOut();
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  console.log("Getting current session:", data.session);
  return { data, error };
}

export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("Auth state change event:", event, "Session:", session);
    callback(session);
  });
}
