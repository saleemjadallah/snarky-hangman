// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ogycucyovscunayusywa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9neWN1Y3lvdnNjdW5heXVzeXdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MTIxMTcsImV4cCI6MjA1NTE4ODExN30.dmPmKkelUxClhXqBoEjjRzOuhWMtD9lBR_ZqSootiMM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);