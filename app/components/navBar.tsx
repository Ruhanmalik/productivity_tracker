import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NavBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <div>
        <Link href="/">Home</Link>
      </div>
      {user && (
        <div>
          <span>Logged in as: {user.email}</span>
        </div>
      )}
    </nav>
  );
}
