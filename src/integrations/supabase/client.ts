import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Lê da variável de ambiente (injetada no build Vite)
// Em produção: VITE_SUPABASE_URL=https://biblia.seudominio.com.br
// Em dev local: VITE_SUPABASE_URL=http://localhost:8080
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    '[Bíblia] VITE_SUPABASE_URL ou VITE_SUPABASE_ANON_KEY não definidos.\n' +
    'Copie .env.example para .env e preencha os valores.'
  );
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});