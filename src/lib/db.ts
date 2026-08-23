import { createClient } from "@supabase/supabase-js";

// W3BB-owned Supabase project (public url + publishable/anon key). Both are
// safe to ship in the browser bundle -- every table this key can touch is
// locked down with insert-only Row Level Security (see supabase/schema.sql).
const url = "https://jpywgvrtjzcstzgrfkbg.supabase.co";
const publishableKey = "sb_publishable_lZo1yg-veJofm4VpDCJB-w_-zQtpRrz";

export const db = createClient(url, publishableKey);
export default db;
