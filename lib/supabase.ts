import { createClient } from '@supabase/supabase-js';

// -- daily_logs: id, date (unique), dsa_done, redlix_done, class_done, college_done,
// --             sleep_hours, energy, distraction, brain_dump, focus_score, created_at
// -- dsa_problems: id, topic, difficulty (easy/medium/hard), date, created_at

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
