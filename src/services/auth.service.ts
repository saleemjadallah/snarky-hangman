
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";

export async function signUp(email: string, username: string) {
  // Generate a simple password for demo purposes (in production, you'd want a proper password field)
  const password = `${email}_${Date.now()}`;

  // First create the actual user account
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username // Store username in user metadata
      }
    }
  });

  if (signUpError) throw signUpError;
  if (!authData.user) throw new Error('No user data returned');

  // Store the password in localStorage for this demo (NOT recommended for production!)
  localStorage.setItem(`pwd_${email}`, password);

  // The profile will be created automatically by our database trigger
  console.log("User created:", authData);

  return { session: authData.session };
}

export async function signIn(email: string) {
  // Retrieve the stored password for this demo
  const password = localStorage.getItem(`pwd_${email}`);
  
  if (!password) {
    throw new Error('Account not found. Please sign up first.');
  }

  const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password
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
  // Clear stored password on signout
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user?.email) {
    localStorage.removeItem(`pwd_${session.user.email}`);
  }
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
