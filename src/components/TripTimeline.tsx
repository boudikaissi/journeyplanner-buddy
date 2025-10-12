import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeekCalendar from "./calendar/WeekCalendar";
import { CalendarEvent } from "./calendar/types";

interface TripTimelineProps {
  tripId: string;
  startDate: string;
  endDate: string;
}

const TripTimeline = ({ tripId, startDate, endDate }: TripTimelineProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([
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
  ]);

  // Generate array of dates from start to end
  const tripDates: Date[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    tripDates.push(new Date(d));
  }

  return (
    <div className="h-[800px]">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>Trip Schedule</CardTitle>
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