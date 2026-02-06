/**
 * Supabase Client Singleton
 * 
 * This file provides a single instance of the Supabase client
 * to avoid "Multiple GoTrueClient instances detected" warnings.
 * 
 * Use this singleton throughout the application instead of creating
 * new instances with createClient().
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Create singleton instance
let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    );
  }
  return supabaseInstance;
}

// Export singleton for convenience
export const supabase = getSupabaseClient();
