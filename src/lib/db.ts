import { createClient } from "@supabase/supabase-js";

// SuperCool managed database (public url + anon key).
const url = "https://prj19f5fdb52746a3787654.databasepad.com";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjgxN2M3YjM5LWFjMDgtNDlmZC04YzM1LWUzMTliZTA4ZjAwOSJ9.eyJwcm9qZWN0SWQiOiJwcmoxOWY1ZmRiNTI3NDZhMzc4NzY1NCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzg2MDkyNjAwLCJleHAiOjIxMDE0NTI2MDAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.iYEhqcpo6qGP4JjJxn7ODW5_uX9JI_JQK2xj2Qrymtw";

export const db = createClient(url, anonKey);
export default db;
