import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Calendar } from "@/app/components/Calendar";

export default async function CalendarPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
        return (
            <div className="flex items-center justify-center h-screen text-red-600">
                Error loading events. Please try again.
            </div>
        );
    }

    return (
        <div style={{ height: 'calc(100vh - 57px)' }} className="flex flex-col overflow-hidden">
            <Calendar events={events || []} />
        </div>
    );
}
