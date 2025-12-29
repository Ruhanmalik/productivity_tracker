import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function NavBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <div>
        <Link href="/">Schedule.io</Link>
      </div>
      {user && (
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <span>Logged in as: {user.email}</span>
          <form action="/auth/logout" method="post">
            <button type="submit">Logout</button>
          </form>
        </div>
      )}
    </nav>
  );
}
