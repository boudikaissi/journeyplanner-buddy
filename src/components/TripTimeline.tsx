import { useState } from "react";
import { Plus, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  location?: string;
  category: "activity" | "transport" | "accommodation" | "meal" | "other";
}

interface TripTimelineProps {
  tripId: string;
  startDate: string;
  endDate: string;
}

const TripTimeline = ({ tripId, startDate, endDate }: TripTimelineProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(startDate));
  const [events] = useState<TimelineEvent[]>([
    {
      id: "1",
      title: "Flight to Bali",
      description: "Departure from San Francisco",
      startTime: "08:00",
      endTime: "14:00",
      date: "2024-08-15",
      location: "SFO Airport",
      category: "transport"
    },
    {
      id: "2", 
      title: "Hotel Check-in",
      description: "Ubud Resort",
      startTime: "15:00",
      endTime: "16:00",
      date: "2024-08-15",
      location: "Ubud Resort",
      category: "accommodation"
    },
    {
      id: "3",
      title: "Temple Tour",
      description: "Visit ancient temples in Ubud",
      startTime: "09:00",
      endTime: "12:00",
      date: "2024-08-16",
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
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "activity": return "bg-blue-100 text-blue-800 border-blue-200";
      case "transport": return "bg-green-100 text-green-800 border-green-200";
      case "accommodation": return "bg-purple-100 text-purple-800 border-purple-200";
      case "meal": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const hoursArray = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Calendar Picker */}
      <div className="lg:col-span-1">
        <Card>
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
          </CardContent>
        </Card>
      </div>

      {/* Timeline View */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
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
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Hour Grid */}
              <div className="grid grid-cols-24 gap-1 text-xs text-muted-foreground mb-4">
                {hoursArray.map(hour => (
                  <div key={hour} className="text-center">
                    {hour.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>

              {/* Events */}
              <div className="space-y-3">
                {getEventsForDate(selectedDate).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No events scheduled for this day
                  </div>
                ) : (
                  getEventsForDate(selectedDate).map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:shadow-soft transition-all cursor-pointer"
                    >
                      <div className="flex-shrink-0 text-sm font-mono text-muted-foreground min-w-[100px]">
                        {event.startTime} - {event.endTime}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{event.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`${getCategoryColor(event.category)} border text-xs`}
                          >
                            {event.category}
                          </Badge>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        )}
                        
                        {event.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TripTimeline;