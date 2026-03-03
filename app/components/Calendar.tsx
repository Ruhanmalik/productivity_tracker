"use client"

import { useState } from "react";
import { Event, CalendarView } from "@/lib/types";
import {
    getCalendarDays,
    isToday,
    isCurrentMonth,
    isSameDay,
    formatMonthYear,
    getEventsForDate
} from "@/lib/calendar-utils";
import { on } from "events";

type CalendarProps = {
    events: Event[];
    onDateSelect?: (date: Date) => void;
    onEventClick?: (event: Event) => void;
};

export function Calendar({ events, onDateSelect, onEventClick }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [view, setView] = useState<CalendarView>("month");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const calendarDays = getCalendarDays(year, month);

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    const gotToPrevious = () => {
        const newDate = new Date(currentDate);
        if (view === "month") {
            newDate.setMonth(newDate.getMonth() - 1);
        } else if (view === "week") {
            newDate.setFullYear(newDate.getFullYear() - 7);
        } else {
            newDate.setFullYear(newDate.getFullYear() - 1);
        }
        setCurrentDate(newDate);
    }

    const goToNext = () => {
        const newDate = new Date(currentDate);
        if (view === "month") {
            newDate.setMonth(newDate.getMonth() + 1);
        } else if (view === "week") {
            newDate.setFullYear(newDate.getFullYear() + 7);
        } else {
            newDate.setFullYear(newDate.getFullYear() + 1);
        }
        setCurrentDate(newDate);
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        onDateSelect?.(date);
    }

    const renderMonthView = () => (
        
    )
}