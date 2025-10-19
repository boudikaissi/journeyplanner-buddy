import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeekCalendar from "./WeekCalendar";
import CreateEventDialog from "./CreateEventDialog";
import { CalendarEvent } from "./types";

interface TripTimelineProps {
  tripId: string;
  startDate: string;
  endDate: string;
}

const TripTimeline = ({ tripId, startDate, endDate }: TripTimelineProps) => {
  // Load events from localStorage on mount
  const loadEventsFromStorage = (): CalendarEvent[] => {
    const stored = localStorage.getItem(`trip-events-${tripId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((event: any) => ({
          ...event,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime)
        }));
      } catch (e) {
        console.error('Error loading events:', e);
      }
    }
    // Return default events if nothing in storage
    return [
      {
        id: "1",
        title: "Flight to Bali",
        description: "Departure from San Francisco",
        startTime: new Date(`${startDate}T08:00:00`),
        endTime: new Date(`${startDate}T14:00:00`),
        location: "SFO Airport",
        category: "transport"
      },
      {
        id: "2", 
        title: "Hotel Check-in",
        description: "Ubud Resort",
        startTime: new Date(`${startDate}T15:00:00`),
        endTime: new Date(`${startDate}T16:00:00`),
        location: "Ubud Resort",
        category: "accommodation"
      },
      {
        id: "3",
        title: "Temple Tour",
        description: "Visit ancient temples in Ubud",
        startTime: new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
        endTime: new Date(new Date(startDate).getTime() + 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
        location: "Ubud",
        category: "activity"
      }
    ];
  };

  const [events, setEvents] = useState<CalendarEvent[]>(loadEventsFromStorage);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`trip-events-${tripId}`, JSON.stringify(events));
  }, [events, tripId]);

  // Generate array of dates from start to end
  const tripDates: Date[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    tripDates.push(new Date(d));
  }

  const handleCreateEvent = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  return (
    <div className="h-[800px]">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle>Trip Schedule</CardTitle>
            <CreateEventDialog dates={tripDates} onCreateEvent={handleCreateEvent} />
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-4">
          <WeekCalendar
            dates={tripDates}
            events={events}
            onEventsChange={setEvents}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TripTimeline;