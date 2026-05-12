import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkRLS() {
  console.log("Checking RLS...");
  
  // Como usamos el anon_key sin sesión (usuario deslogueado),
  // RLS debería bloquear la lectura y devolver 0 registros.
  const { data, error } = await supabase.from('books').select('*');
  
  if (error) {
    console.error("Error:", error.message);
  } else {
    if (data.length === 0) {
      console.log("¡ÉXITO! RLS está activo. Una petición anónima no puede ver ningún libro.");
    } else {
      console.log(`FALLO: Se pudieron leer ${data.length} libros sin iniciar sesión. RLS NO está activo o las políticas son permisivas.`);
    }
  }
}

checkRLS();
