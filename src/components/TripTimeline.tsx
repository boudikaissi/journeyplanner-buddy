import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CalendarComponent from "./calendar/Calendar";
import { CalendarEvent } from "./calendar/types";

interface TripTimelineProps {
  tripId: string;
  startDate: string;
  endDate: string;
}

const TripTimeline = ({ tripId, startDate, endDate }: TripTimelineProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-[800px]">
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle>Trip Schedule</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollLeft}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollRight}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 p-0">
          <div 
            ref={scrollContainerRef}
            className="h-full overflow-x-auto overflow-y-hidden"
          >
            <div className="flex h-full" style={{ minWidth: `${tripDates.length * 400}px` }}>
              {tripDates.map((date, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 border-r last:border-r-0"
                  style={{ width: '400px' }}
                >
                  <div className="h-full flex flex-col">
                    <div className="px-4 py-3 border-b bg-muted/30">
                      <div className="font-semibold text-sm">
                        {formatDateShort(date)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {events.filter(event => {
                          const eventDate = new Date(event.startTime);
                          return eventDate.toDateString() === date.toDateString();
                        }).length} events
                      </div>
                    </div>
                    <div className="flex-1 min-h-0">
                      <CalendarComponent
                        date={date}
                        events={events}
                        onEventsChange={setEvents}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripTimeline;