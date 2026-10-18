import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// The anon ("publishable") key is PUBLIC by design — every Supabase web app ships
// it in the browser bundle. It is safe to keep here because the `bookings` table
// has Row Level Security ON with no public policies: the only thing this key can do
// is call the two locked-down functions `taken_slots()` (read date+hour only) and
// `book_slot()` (insert one booking). The secret service_role key is never used here.
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || 'https://yiqljziwysqegoabjrel.supabase.co';
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpcWxqeml3eXNxZWdvYWJqcmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTI4MTQsImV4cCI6MjEwMTA4ODgxNH0.J8cCSEGGy-KvEN3oQx9AtSQUTm3sRFNmoEOS5Hk7kZI';

export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon, { auth: { persistSession: false } }) : null;
