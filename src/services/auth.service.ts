import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";
import { Database } from "@/integrations/supabase/types";

// Define the expected response type from create_test_session RPC
type RPCResponse<T> = T extends keyof Database['public']['Functions'] 
  ? Database['public']['Functions'][T]['Returns'] 
  : never;

type TestSessionResponse = {
  user_id: string;
  email: string;
};

async function waitForSession(maxAttempts = 5): Promise<boolean> {
  for (let i = 0; i < maxAttempts; i++) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) return true;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between attempts
  }
  return false;
}

export async function signUp(email: string, username: string) {
  // First create the test session with just email
  const { data: sessionData, error: sessionError } = await supabase.rpc(
    'create_test_session',
    { user_email: email }
  );
  
  if (sessionError) throw sessionError;
  if (!sessionData || typeof sessionData !== 'object') throw new Error('No session data returned');
  
  const typedSessionData = sessionData as TestSessionResponse;
  console.log("Test session created:", typedSessionData);

  // Wait longer for the database trigger and session establishment
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Update the username in profiles table
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ username })
    .eq('id', typedSessionData.user_id);

  if (updateError) throw updateError;

  // Wait for session to be established
  const sessionEstablished = await waitForSession();
  if (!sessionEstablished) throw new Error('Failed to establish session after multiple attempts');

  // Get the final session state
  const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
  if (getSessionError) throw getSessionError;
  if (!session) throw new Error('Session not established');

  return { session };
}

export async function signIn(email: string) {
  // Create test session for existing user
  const { data: sessionData, error: sessionError } = await supabase.rpc(
    'create_test_session',
    { user_email: email }
  );
  
  if (sessionError) throw sessionError;
  if (!sessionData || typeof sessionData !== 'object') throw new Error('No session data returned');
  
  const typedSessionData = sessionData as TestSessionResponse;
  console.log("Test session created:", typedSessionData);

  // Wait longer for the database trigger and session establishment
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Wait for session to be established
  const sessionEstablished = await waitForSession();
  if (!sessionEstablished) throw new Error('Failed to establish session after multiple attempts');

  // Get the final session state
  const { data: { session }, error: getSessionError } = await supabase.auth.getSession();
  if (getSessionError) throw getSessionError;
  if (!session) throw new Error('Session not established');

  return { session };
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
