import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing environment variable NEXT_PUBLIC_SUPABASE_URL. Add it to your .env.local.",
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it to your .env.local.",
  );
}

/**
 * Typed Supabase client for use in the browser. Every query is inferred from
 * the generated `Database` types in `database.types.ts`.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
