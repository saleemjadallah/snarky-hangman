
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  
  if (error) throw error;
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
  const { error } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', userId);

  if (error) throw error;
}

export async function createTestSession(email: string) {
  return await supabase.rpc('create_test_session', {
    user_email: email
  });
}

export async function signOutUser() {
  return await supabase.auth.signOut();
}

export async function getCurrentSession() {
  return await supabase.auth.getSession();
}

export function onAuthStateChange(callback: (session: any) => void) {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    callback(session);
  });
}
