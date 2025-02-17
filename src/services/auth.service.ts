
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";

interface TestSessionResponse {
  user_id: string;
  email: string;
}

export async function signUp(email: string, username: string) {
  // First create the test session with just email
  const { data: sessionData, error: sessionError } = await supabase.rpc<TestSessionResponse>('create_test_session', {
    user_email: email
  });
  
  if (sessionError) throw sessionError;
  if (!sessionData) throw new Error('No session data returned');
  
  console.log("Test session created:", sessionData);

  // Wait for the database trigger to complete
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Update the username in profiles table
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', sessionData.user_id);

  if (updateError) throw updateError;

  // Get the session
  const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
  if (getSessionError) throw getSessionError;
  if (!session) throw new Error('Session not established');

  // Force refresh the session to ensure it's properly established
  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) throw refreshError;
  if (!refreshData.session) throw new Error('Failed to refresh session');

  return { session: refreshData.session };
}

export async function signIn(email: string) {
  // Create test session for existing user
  const { data: sessionData, error: sessionError } = await supabase.rpc<TestSessionResponse>('create_test_session', {
    user_email: email
  });
  
  if (sessionError) throw sessionError;
  if (!sessionData) throw new Error('No session data returned');
  
  console.log("Test session created:", sessionData);

  // Wait for the database trigger to complete
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Get the session
  const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
  if (getSessionError) throw getSessionError;
  if (!session) throw new Error('Session not established');

  // Force refresh the session to ensure it's properly established
  const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) throw refreshError;
  if (!refreshData.session) throw new Error('Failed to refresh session');

  return { session: refreshData.session };
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
