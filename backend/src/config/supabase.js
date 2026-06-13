import { createClient } from '@supabase/supabase-js';
import { env } from './environment.js';
import logger from '../utils/logger.js';

let supabase = null;

if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
  try {
    // Use service role key if available for backend administrative actions, fallback to anon key
    const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY;
    supabase = createClient(env.SUPABASE_URL, key, {
      auth: {
        persistSession: false
      }
    });
    logger.info('✅ Supabase client successfully initialized.');
  } catch (error) {
    logger.error(`❌ Supabase Client Error: ${error.message}`);
  }
} else {
  logger.warn('⚠️ SUPABASE_URL or SUPABASE_ANON_KEY not configured. AI Customizer will fall back to mock data.');
}

export default supabase;
