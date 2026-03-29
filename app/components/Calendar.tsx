"use client"

import { useState } from "react";
import { Event, CalendarView } from "@/lib/types";
import {
    getCalendarDays,
    isToday,
    isCurrentMonth,
    isSameDay,
    formatMonthYear,
    getEventsForDate,
    formatEventTime,
} from "@/lib/calendar-utils";
import { createEvent, updateEvent, deleteEvent } from "@/app/actions/events";

type CalendarProps = {
    events: Event[];
    onDateSelect?: (date: Date) => void;
    onEventClick?: (event: Event) => void;
};

type ModalState =
    | { type: "create"; date: Date }
    | { type: "view"; event: Event }
    | { type: "edit"; event: Event }
    | null;

function toDatetimeLocal(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Calendar({ events: initialEvents, onDateSelect, onEventClick }: CalendarProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [view, setView] = useState<CalendarView>("month");
    const [modal, setModal] = useState<ModalState>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const calendarDays = getCalendarDays(year, month);

    const closeModal = () => { setModal(null); setError(null); };

    const navigate = (dir: -1 | 1) => {
        const d = new Date(currentDate);
        if (view === "month") d.setMonth(d.getMonth() + dir);
        else if (view === "week") d.setDate(d.getDate() + dir * 7);
        else d.setDate(d.getDate() + dir);
        setCurrentDate(d);
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        onDateSelect?.(date);
        setModal({ type: "create", date });
    };

    const handleEventClick = (event: Event, e: React.MouseEvent) => {
        e.stopPropagation();
        onEventClick?.(event);
        setModal({ type: "view", event });
    };

    const handleCreate = async (formData: FormData) => {
        setLoading(true); setError(null);
        const result = await createEvent(formData);
        if (result.error) { setError(result.error); }
        else if (result.data) { setEvents(prev => [...prev, result.data as Event]); closeModal(); }
        setLoading(false);
    };

    const handleUpdate = async (formData: FormData) => {
        if (modal?.type !== "edit") return;
        const eventId = modal.event.id;
        setLoading(true); setError(null);
        const result = await updateEvent(formData, eventId);
        if (result.error) { setError(result.error); }
        else if (result.data) {
            setEvents(prev => prev.map(e => e.id === eventId ? result.data as Event : e));
            closeModal();
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        setLoading(true); setError(null);
        const result = await deleteEvent(id);
        if (result.error) { setError(result.error); }
        else { setEvents(prev => prev.filter(e => e.id !== id)); closeModal(); }
        setLoading(false);
    };

    /* ── Toolbar ── */
    const toolbar = (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            rowGap: 10,
            columnGap: 12,
            padding: "12px 16px",
            borderBottom: "1px solid #1C1C1F",
            background: "#0C0C0E",
            minWidth: 0,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: "1 1 200px" }}>
                <ToolbarBtn onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }}>
                    Today
                </ToolbarBtn>
                <ToolbarIconBtn onClick={() => navigate(-1)}>‹</ToolbarIconBtn>
                <ToolbarIconBtn onClick={() => navigate(1)}>›</ToolbarIconBtn>
                <span style={{
                    fontFamily: "var(--font-family-sans)",
                    fontSize: 15,
                    fontWeight: 600,
                    color: "#F0F0F2",
                    letterSpacing: "-0.02em",
                    marginLeft: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}>
                    {formatMonthYear(currentDate)}
                </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: "auto" }}>
                <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: 12, padding: "6px 14px", borderRadius: 6, boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}
                    onClick={() => setModal({ type: "create", date: selectedDate ?? new Date() })}
                >
                    + New Event
                </button>
                <div style={{ display: "flex", gap: 4 }}>
                    {(["month", "week", "day", "agenda"] as CalendarView[]).map(v => (
                        <button key={v} onClick={() => setView(v)} style={{
                            fontFamily: "var(--font-family-sans)",
                            fontSize: 12,
                            fontWeight: 500,
                            padding: "5px 12px",
                            borderRadius: 6,
                            border: view === v ? "1px solid rgba(0,217,126,0.4)" : "1px solid #2A2A2D",
                            background: view === v ? "rgba(0,217,126,0.10)" : "transparent",
                            color: view === v ? "#00D97E" : "#71717A",
                            cursor: "pointer",
                            textTransform: "capitalize",
                            transition: "all 0.12s",
                        }}>
                            {v}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    /* ── Month grid ── */
    const monthView = (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #1C1C1F" }}>
                {DAY_LABELS.map(d => (
                    <div key={d} style={{
                        padding: "8px 0",
                        textAlign: "center",
                        fontFamily: "var(--font-family-mono)",
                        fontSize: 10,
                        fontWeight: 500,
                        color: "#3F3F46",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                    }}>
                        {d}
                    </div>
                ))}
            </div>
            {/* Day cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", flex: 1 }}>
                {calendarDays.map((date, i) => {
                    const dayEvents = getEventsForDate(events, date) as Event[];
                    const inMonth = isCurrentMonth(date, month);
                    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                    const isTodayCell = isToday(date);

                    return (
                        <div
                            key={i}
                            onClick={() => handleDateClick(date)}
                            className={[
                                "cal-day-cell",
                                inMonth ? "in-month" : "other-month",
                                isSelected ? "selected" : "",
                                isTodayCell ? "today" : "",
                            ].filter(Boolean).join(" ")}
                        >
                            <div style={{ marginBottom: 4 }}>
                                <span className="cal-day-num">{date.getDate()}</span>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {dayEvents.slice(0, 3).map(event => (
                                    <span
                                        key={event.id}
                                        className="cal-event-chip"
                                        onClick={(e) => handleEventClick(event, e)}
                                        title={event.title}
                                    >
                                        {formatEventTime(event.start_time)} {event.title}
                                    </span>
                                ))}
                                {dayEvents.length > 3 && (
                                    <span style={{
                                        fontSize: 10,
                                        color: "#52525B",
                                        paddingLeft: 4,
                                        fontFamily: "var(--font-family-mono)",
                                    }}>
                                        +{dayEvents.length - 3} more
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    /* ── Agenda view ── */
    const agendaView = (() => {
        const upcoming = [...events]
            .filter(e => new Date(e.start_time) >= new Date(new Date().setHours(0, 0, 0, 0)))
            .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

        return (
            <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
                {upcoming.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#3F3F46", padding: "60px 0", fontFamily: "var(--font-family-mono)", fontSize: 13 }}>
                        — no upcoming events —
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 640, margin: "0 auto" }}>
                        {upcoming.map(event => (
                            <div
                                key={event.id}
                                onClick={(e) => handleEventClick(event, e)}
                                style={{
                                    display: "flex",
                                    gap: 16,
                                    padding: "14px 16px",
                                    background: "#131315",
                                    border: "1px solid #2A2A2D",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                    transition: "border-color 0.12s, background 0.12s",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(0,217,126,0.3)";
                                    (e.currentTarget as HTMLDivElement).style.background = "#16161A";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLDivElement).style.borderColor = "#2A2A2D";
                                    (e.currentTarget as HTMLDivElement).style.background = "#131315";
                                }}
                            >
                                <div style={{ minWidth: 110 }}>
                                    <div style={{ fontFamily: "var(--font-family-sans)", fontSize: 12, fontWeight: 600, color: "#A1A1AA" }}>
                                        {new Date(event.start_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                    </div>
                                    <div style={{ fontFamily: "var(--font-family-mono)", fontSize: 11, color: "#52525B", marginTop: 2 }}>
                                        {formatEventTime(event.start_time)}
                                    </div>
                                </div>
                                <div style={{ borderLeft: "2px solid #00D97E", paddingLeft: 14 }}>
                                    <div style={{ fontSize: 14, fontWeight: 500, color: "#F0F0F2" }}>{event.title}</div>
                                    {event.description && (
                                        <div style={{ fontSize: 12, color: "#52525B", marginTop: 3 }}>{event.description}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    })();

    /* ── Modal ── */
    const renderModal = () => {
        if (!modal) return null;

        const isCreate = modal.type === "create";
        const isView   = modal.type === "view";
        const isEdit   = modal.type === "edit";

        return (
            <div className="modal-overlay" onClick={closeModal}>
                <div className="modal-box" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <span className="modal-title">
                            {isCreate ? "New event" : isView ? (modal as { type: "view"; event: Event }).event.title : "Edit event"}
                        </span>
                        <button className="modal-close" onClick={closeModal}>×</button>
                    </div>

                    {error && <div className="alert-error">{error}</div>}

                    {/* View */}
                    {isView && (
                        <>
                            <div className="event-meta" style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                                {(modal as { type: "view"; event: Event }).event.description && (
                                    <p style={{ fontSize: 13, color: "#A1A1AA", margin: 0, lineHeight: 1.6 }}>
                                        {(modal as { type: "view"; event: Event }).event.description}
                                    </p>
                                )}
                                <div>
                                    <strong>Start</strong>{" "}
                                    {new Date((modal as { type: "view"; event: Event }).event.start_time).toLocaleString("en-US", {
                                        weekday: "short", month: "short", day: "numeric",
                                        hour: "numeric", minute: "2-digit"
                                    })}
                                </div>
                                {(modal as { type: "view"; event: Event }).event.end_time && (
                                    <div>
                                        <strong>End</strong>{" "}
                                        {new Date((modal as { type: "view"; event: Event }).event.end_time!).toLocaleString("en-US", {
                                            weekday: "short", month: "short", day: "numeric",
                                            hour: "numeric", minute: "2-digit"
                                        })}
                                    </div>
                                )}
                            </div>
                            <div className="modal-actions">
                                <button className="btn btn-secondary" onClick={() => setModal({ type: "edit", event: (modal as { type: "view"; event: Event }).event })}>Edit</button>
                                <button className="btn btn-danger" disabled={loading} onClick={() => handleDelete((modal as { type: "view"; event: Event }).event.id)}>
                                    {loading ? "Deleting…" : "Delete"}
                                </button>
                            </div>
                        </>
                    )}

                    {/* Create */}
                    {isCreate && (
                        <form action={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Title *</label>
                                <input type="text" name="title" required autoFocus placeholder="Event title" />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Description</label>
                                <textarea name="description" rows={2} placeholder="Optional description" style={{ resize: "none" }} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Start *</label>
                                    <input
                                        type="datetime-local" name="start_time" required
                                        defaultValue={toDatetimeLocal(new Date(
                                            (modal as { type: "create"; date: Date }).date.getFullYear(),
                                            (modal as { type: "create"; date: Date }).date.getMonth(),
                                            (modal as { type: "create"; date: Date }).date.getDate(), 9, 0
                                        ))}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>End</label>
                                    <input
                                        type="datetime-local" name="end_time"
                                        defaultValue={toDatetimeLocal(new Date(
                                            (modal as { type: "create"; date: Date }).date.getFullYear(),
                                            (modal as { type: "create"; date: Date }).date.getMonth(),
                                            (modal as { type: "create"; date: Date }).date.getDate(), 10, 0
                                        ))}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions" style={{ marginTop: 6 }}>
                                <button type="submit" className="btn btn-accent" disabled={loading}>
                                    {loading ? "Creating…" : "Create event"}
                                </button>
                                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    )}

                    {/* Edit */}
                    {isEdit && (
                        <form action={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Title *</label>
                                <input type="text" name="title" required defaultValue={(modal as { type: "edit"; event: Event }).event.title} />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label>Description</label>
                                <textarea name="description" rows={2} defaultValue={(modal as { type: "edit"; event: Event }).event.description || ""} style={{ resize: "none" }} />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>Start *</label>
                                    <input
                                        type="datetime-local" name="start_time" required
                                        defaultValue={new Date((modal as { type: "edit"; event: Event }).event.start_time).toISOString().slice(0, 16)}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label>End</label>
                                    <input
                                        type="datetime-local" name="end_time"
                                        defaultValue={(modal as { type: "edit"; event: Event }).event.end_time
                                            ? new Date((modal as { type: "edit"; event: Event }).event.end_time!).toISOString().slice(0, 16)
                                            : ""}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions" style={{ marginTop: 6 }}>
                                <button type="submit" className="btn btn-accent" disabled={loading}>
                                    {loading ? "Saving…" : "Save changes"}
                                </button>
                                <button type="button" className="btn btn-ghost" onClick={() => { setError(null); setModal({ type: "view", event: (modal as { type: "edit"; event: Event }).event }); }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#09090B" }}>
            {toolbar}
            {view === "month"  && monthView}
            {view === "agenda" && agendaView}
            {(view === "week" || view === "day") && (
                <div style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-family-mono)",
                    fontSize: 12,
                    color: "#3F3F46",
                    letterSpacing: "0.06em",
                }}>
                    {view} view — coming soon
                </div>
            )}
            {renderModal()}
        </div>
    );
}

/* ── Toolbar sub-components ── */
function ToolbarBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button onClick={onClick} style={{
            fontFamily: "var(--font-family-sans)",
            fontSize: 12,
            fontWeight: 500,
            padding: "5px 12px",
            borderRadius: 6,
            border: "1px solid #2A2A2D",
            background: "transparent",
            color: "#A1A1AA",
            cursor: "pointer",
            transition: "all 0.12s",
        }}
        onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1C1C1F";
            (e.currentTarget as HTMLButtonElement).style.color = "#F0F0F2";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#3F3F46";
        }}
        onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#A1A1AA";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#2A2A2D";
        }}>
            {children}
        </button>
    );
}

function ToolbarIconBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
    return (
        <button onClick={onClick} style={{
            width: 28, height: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 6,
            border: "1px solid #2A2A2D",
            background: "transparent",
            color: "#71717A",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            transition: "all 0.12s",
        }}
        onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1C1C1F";
            (e.currentTarget as HTMLButtonElement).style.color = "#F0F0F2";
        }}
        onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#71717A";
        }}>
            {children}
        </button>
    );
}
