import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yudlcjkunrmjrlklgtor.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1ZGxjamt1bnJtanJsa2xndG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjUyNDQsImV4cCI6MjA4OTc0MTI0NH0._8NF63fzdbK0USsnh4ENn2f0yrsOjhuDYEggRof9ph8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
