import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

export const supabaseAdmin = createClient(config.supabaseUrl, config.serviceRole, {
  auth: { persistSession: false }
});

export const getUserClient = (accessToken) => {
  // Create a client that forwards the user's JWT for RLS
  return createClient(config.supabaseUrl, config.anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false }
  });
};
