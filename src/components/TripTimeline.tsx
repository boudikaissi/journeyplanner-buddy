import { useState } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import CalendarComponent from "./calendar/Calendar";
import { CalendarEvent } from "./calendar/types";

interface TripTimelineProps {
  tripId: string;
  startDate: string;
  endDate: string;
}

const TripTimeline = ({ tripId, startDate, endDate }: TripTimelineProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(startDate));
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]">
      {/* Calendar Picker */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Select Date</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              disabled={(date) => {
                const start = new Date(startDate);
                const end = new Date(endDate);
                return date < start || date > end;
              }}
              className="rounded-md border"
            />
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="font-medium mb-1">Quick Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Click and drag to create events</li>
                <li>• Drag events to move them</li>
                <li>• Resize from edges to adjust time</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notion-style Calendar View */}
      <div className="lg:col-span-3">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {formatDate(selectedDate)}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {getEventsForDate(selectedDate).length} events scheduled
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <CalendarComponent
              date={selectedDate}
              events={events}
              onEventsChange={setEvents}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripTimeline;