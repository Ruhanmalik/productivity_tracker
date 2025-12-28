import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EventList } from "./components/EventList";

export default async function Home() {
  const supabase = await createClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch all events for this user
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('start_time', { ascending: true })

  if (error) {
    console.error('Error fetching events:', error)
    return <div>Error loading events</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <EventList events={events || []} />
    </div>
  )
}