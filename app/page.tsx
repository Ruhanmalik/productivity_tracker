import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // If user is not authenticated, redirect to login
  if (!user || error) {
    redirect("/auth/login");
  }

  // If user is authenticated, show home page
  return (
    <div>
      <h1>Welcome to Productivity Tracker</h1>
      <p>You are logged in as: {user.email}</p>
    </div>
  );
}
