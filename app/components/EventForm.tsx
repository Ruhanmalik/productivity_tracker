"use client";

import { updateEvent, createEvent } from "../actions/events";
import { useState } from "react";

type EventFormProps = {
    event? : {
        id: string;
        title: string;
        description: string | null;
        start_time: string;
        end_time: string | null;
    }
    onClose? : () => void;   
}

export function EventForm({ event, onClose } : EventFormProps) {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<string | null>(null);

    const handleSubmit = async( formData: FormData) => {
        setLoading(true);
        setError(null);

        const result = event 
            ? await updateEvent(formData, event.id)
            : await createEvent(formData)

        if (result.error) {
            setError(result.error);
            setLoading(false)
        } else {
            setLoading(false);
            onClose?.()
        }
    }

    return (
        <form action={handleSubmit}>
            <h2>
                {event ? "Edit Event" : "Create Event"}
            </h2>

            {error &&
                <div>
                    {error}
                </div>
                }
            <div>
                <label htmlFor="title">
                    Title *
                    <input
                        type="text"
                        id="title"
                        name="title"
                        defaultValue={event?.title || ""}
                        required
                        />
                </label>
            </div>

            <div>
                <label htmlFor="description">
                    Description
                    <textarea
                        id="description"
                        name="description"
                        defaultValue={event?.description || ""}
                        rows={3}
                        />
                </label>
            </div>

            <div>
                <label htmlFor="start_time">
                    Start Time *
                    <input
                        type="datetime-local"
                        id="start_time"
                        name="start_time"
                        required
                        defaultValue={event?.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : ''}
                    />
                </label>
            </div>

            <div>
                <label htmlFor="end_time">
                    End Time
                    <input
                        type="datetime-local"
                        id="end_time"
                        name="end_time"
                        defaultValue={event?.end_time ? new Date(event.end_time).toISOString().slice(0, 16) : ''}
                    />
                </label>
            </div>

            <div>
                <button
                type="submit"
                disabled={loading}
                >
                    {loading ? "Saving..." : (event ? "Update Event" : "Create Event")}
                </button>

                {onClose && (
                    <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}