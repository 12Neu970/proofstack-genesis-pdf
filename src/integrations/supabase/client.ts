// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rfvnzuxwhtrqttgmbjfn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmdm56dXh3aHRycXR0Z21iamZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzU5NDUsImV4cCI6MjA2NTI1MTk0NX0.Iqk_ZGZCEnbSPtPp6OdC7rkatHRMNjGoe6JRTMIBpmo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);