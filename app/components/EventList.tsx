"use client"

import { useState } from "react";
import { EventForm } from "./EventForm";
import { deleteEvent } from "../actions/events";

type Event = {
    id: string;
    title: string;
    description: string | null
    start_time: string
    end_time: string | null
}

type EventListProps = {
    events: Event[]
}

export function EventList({ events }: EventListProps) {

    const [ editingEvent, setEditingEvent ] = useState<Event | null>(null)
    const [ showCreateForm, setShowCreateForm ] = useState(false);

    const handleDelete = async(eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) {
            return;
        }

        const result = await deleteEvent(eventId);
        if (result.error) {
            alert("Error deleting event: " + result.error);
        }

        const formatDate = (dateString: string) => {
            const date = new Date(dateString)
            return date.toLocaleString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit'});
    }
}

    return (
        <div>
          <div>
            <h1>My Events</h1>
            <button
              onClick={() => setShowCreateForm(true)}
            >
              + New Event
            </button>
          </div>
    
          {/* Create Form */}
          {showCreateForm && (
            <EventForm onClose={() => setShowCreateForm(false)} />
          )}
    
          {/* Edit Form */}
          {editingEvent && (
            <EventForm 
              event={editingEvent} 
              onClose={() => setEditingEvent(null)} 
            />
          )}
    
          {/* Event List */}
          <div>
            {events.length === 0 ? (
              <p>
                No events yet. Create one to get started!
              </p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                >
                  <div>
                    <div>
                      <h3>{event.title}</h3>
                      {event.description && (
                        <p>{event.description}</p>
                      )}
                      <div>
                        <div>🕐 Start: {formatDate(event.start_time)}</div>
                        {event.end_time && (
                          <div>🏁 End: {formatDate(event.end_time)}</div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <button
                        onClick={() => setEditingEvent(event)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )
}