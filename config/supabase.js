// config/supabase.js
import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';

// Service role client (dùng cho storage/upload và các tác vụ admin)
export const supabaseAdmin = createClient(config.supabaseUrl, config.serviceRole, {
  auth: { persistSession: false }
});

// Client theo user (forward Bearer token cho RLS)
export const getUserClient = (accessToken) => {
  return createClient(config.supabaseUrl, config.anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false }
  });
};
