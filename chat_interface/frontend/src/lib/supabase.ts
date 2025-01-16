import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lffgvxlrhtnxwrbedvhc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZmd2eGxyaHRueHdyYmVkdmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5OTY2NTAsImV4cCI6MjA1MjU3MjY1MH0.mJpVa789C7rCdXg3QEp3jWJWXtc4XCQ8Xu0yh-ztiEY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
