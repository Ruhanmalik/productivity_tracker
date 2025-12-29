export function getCalendarDays(year: number, month: number): Date[] {
    const days: Date[] = [];
    
    const firstDay = new Date(year, month, 1);
    
    const lastDay = new Date(year, month + 1, 0);
    
    const startDayOfWeek = firstDay.getDay();
    
    // Add days from previous month to fill the first week
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const prevDate = new Date(year, month, -i);
        days.push(prevDate);
    }
    
    // Add all days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
    }
    
    // Add days from next month to complete the grid (6 rows × 7 days = 42)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
        days.push(new Date(year, month + 1, i));
    }
    
    return days;
}


export function getWeekDays(date: Date): Date[] {
    const days: Date[] = [];
    const dayOfWeek = date.getDay();
    
    // Find Sunday of this week
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - dayOfWeek);
    
    // Generate 7 days starting from Sunday
    for (let i = 0; i < 7; i++) {
        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);
        days.push(day);
    }
    
    return days;
}


export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}


 //Checks if a date is today.
export function isToday(date: Date): boolean {
    return isSameDay(date, new Date());
}

/**
 * Checks if a date is in the given month.
 * Used to style "overflow" days from adjacent months differently.
 */
export function isCurrentMonth(date: Date, month: number): boolean {
    return date.getMonth() === month;
}

/**
 * Formats a date as "December 2025" for the calendar header.
 */
export function formatMonthYear(date: Date): string {
    return date.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
}

/**
 * Formats a date for display in event cards.
 * Example: "Jan 2, 2025"
 */
export function formatEventDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

/**
 * Formats time for display.
 * Example: "10:00 AM"
 */
export function formatEventTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

/**
 * Gets events that fall on a specific date.
 * Used to show event indicators on calendar days.
 */
export function getEventsForDate(events: { start_time: string }[], date: Date): typeof events {
    return events.filter(event => {
        const eventDate = new Date(event.start_time);
        return isSameDay(eventDate, date);
    });
}