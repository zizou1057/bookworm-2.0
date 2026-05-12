import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: b } = await supabase.from('books').select('*').limit(1);
  console.log("books", b ? Object.keys(b[0] || {}) : "err");
  
  const { data: g } = await supabase.from('groups').select('*').limit(1);
  console.log("groups", g ? Object.keys(g[0] || {}) : "err");
  
  const { data: d } = await supabase.from('daily_logs').select('*').limit(1);
  console.log("daily_logs", d ? Object.keys(d[0] || {}) : "err");
}
check();
