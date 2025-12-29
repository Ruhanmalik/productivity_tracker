// Event type matching your Supabase events table
export type Event = {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    start_time: string;  // ISO timestamp from Supabase
    end_time: string | null;
    created_at?: string;
    updated_at?: string;
};

// Todo type matching your Supabase todos table
export type Todo = {
    id: string;
    user_id: string;
    title: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
};

// Calendar view modes
export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

// For the calendar component to track which date is selected
export type CalendarState = {
    currentDate: Date;
    selectedDate: Date | null;
    view: CalendarView;
};


