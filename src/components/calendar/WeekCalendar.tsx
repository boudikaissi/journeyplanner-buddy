import { useState, useRef, useCallback } from 'react';
import { CalendarEvent } from './types';
import CalendarEventComponent from './CalendarEvent';
import AllDayEvent from './AllDayEvent';
import {
  setTimeInMinutes,
  snapToSlot,
  pixelsToMinutes,
  formatHour,
  PIXELS_PER_HOUR
} from './utils';

interface WeekCalendarProps {
  dates: Date[];
  events: CalendarEvent[];
  onEventsChange: (events: CalendarEvent[]) => void;
}

const WeekCalendar = ({ dates, events, onEventsChange }: WeekCalendarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createStart, setCreateStart] = useState<{ dayIndex: number; minutes: number } | null>(null);
  
  // Get month and year for display
  const monthYear = dates[0]?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) || '';

  const handleEventUpdate = useCallback((eventId: string, updates: { startTime?: Date; endTime?: Date; title?: string; location?: string; allDay?: boolean }) => {
    const updatedEvents = events.map(event =>
      event.id === eventId
        ? { ...event, ...updates }
        : event
    );
    onEventsChange(updatedEvents);
  }, [events, onEventsChange]);

  const handleEventDelete = useCallback((eventId: string) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    onEventsChange(updatedEvents);
  }, [events, onEventsChange]);

  const handleSlotPointerDown = useCallback((e: React.PointerEvent, dayIndex: number) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-event-block]')) {
      return;
    }

    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const minutes = snapToSlot(pixelsToMinutes(offsetY));
    
    setIsCreating(true);
    setCreateStart({ dayIndex, minutes });

    const handlePointerMove = (moveEvent: PointerEvent) => {
      // Visual feedback could be added here
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      if (!containerRef.current || !createStart) return;

      const rect = containerRef.current.getBoundingClientRect();
      const endOffsetY = upEvent.clientY - rect.top;
      const endMinutes = snapToSlot(pixelsToMinutes(endOffsetY));

      const startMin = Math.min(createStart.minutes, endMinutes);
      const endMin = Math.max(createStart.minutes, endMinutes);

      if (endMin - startMin >= 15) {
        const newEvent: CalendarEvent = {
          id: `event-${Date.now()}`,
          title: 'New Event',
          startTime: setTimeInMinutes(dates[dayIndex], startMin),
          endTime: setTimeInMinutes(dates[dayIndex], endMin),
          category: 'other'
        };

        onEventsChange([...events, newEvent]);
      }

      setIsCreating(false);
      setCreateStart(null);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }, [dates, events, onEventsChange, createStart]);

  const handleDoubleClick = useCallback((e: React.MouseEvent, dayIndex: number) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-event-block]')) {
      return;
    }

    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const minutes = snapToSlot(pixelsToMinutes(offsetY));

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: 'New Event',
      startTime: setTimeInMinutes(dates[dayIndex], minutes),
      endTime: setTimeInMinutes(dates[dayIndex], minutes + 30),
      category: 'other'
    };

    onEventsChange([...events, newEvent]);
  }, [dates, events, onEventsChange]);

  const handleAllDayDoubleClick = useCallback((dayIndex: number) => {
    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      title: 'New Event',
      startTime: new Date(dates[dayIndex]),
      endTime: new Date(dates[dayIndex]),
      category: 'other',
      allDay: true
    };

    onEventsChange([...events, newEvent]);
  }, [dates, events, onEventsChange]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const gridTop = containerRef.current?.getBoundingClientRect().top || 0;

  const formatDateHeader = (date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    return { day, dayNum };
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Month/Year header */}
      <div className="px-4 py-2 border-b flex-shrink-0">
        <h2 className="text-lg font-semibold">{monthYear}</h2>
      </div>

      {/* Scrollable wrapper for both directions */}
      <div className="flex-1 overflow-auto">
        <div className="flex" style={{ minHeight: `${24 * PIXELS_PER_HOUR + 48}px` }}>
          {/* Time labels column - sticky on left */}
          <div className="w-20 flex-shrink-0 sticky left-0 bg-white z-30 border-r" style={{ height: `${24 * PIXELS_PER_HOUR + 48}px` }}>
            {/* Top-left corner box - stays fixed */}
            <div className="h-12 border-b bg-white sticky top-0 z-50" />
            
            {/* All-day label row */}
            <div className="text-xs text-foreground text-right pr-2 bg-white h-12 flex items-center justify-end border-b sticky top-12 z-40">
              All-day
            </div>
            
            {/* Time labels */}
            {hours.map(hour => (
              <div
                key={hour}
                className="relative text-xs text-foreground text-right pr-2 bg-white border-t border-transparent flex items-start"
                style={{ height: `${PIXELS_PER_HOUR}px`, paddingTop: '0px' }}
              >
                {hour !== 0 && (
                  <span className="w-full" style={{ transform: 'translateY(-50%)' }}>
                    {formatHour(hour)}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Calendar content */}
          <div className="flex-1">
            {/* Header with dates - sticky */}
            <div className="sticky top-0 bg-white z-20">
              <div className="flex border-b h-12">
                {dates.map((date, index) => {
                  const { day, dayNum } = formatDateHeader(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <div
                      key={index}
                      className="border-r last:border-r-0 p-2 text-center flex-shrink-0 bg-white"
                      style={{ width: '200px' }}
                    >
                      <div className="text-xs text-foreground">{day}</div>
                      <div className={`text-sm font-semibold ${isToday ? 'text-primary' : ''}`}>
                        {dayNum}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* All-day events row */}
              <div className="flex border-b h-12 bg-white">
                {dates.map((date, dayIndex) => {
                  const allDayEvents = events.filter(event => {
                    const eventDate = new Date(event.startTime);
                    return event.allDay && eventDate.toDateString() === date.toDateString();
                  });
                  
                  return (
                    <div
                      key={dayIndex}
                      className="border-r last:border-r-0 flex-shrink-0 p-1 space-y-1"
                      style={{ width: '200px' }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleAllDayDoubleClick(dayIndex);
                      }}
                    >
                      {allDayEvents.map(event => (
                        <AllDayEvent
                          key={event.id}
                          event={event}
                          onUpdate={handleEventUpdate}
                          onDelete={handleEventDelete}
                          allDates={dates}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calendar grid */}
            <div ref={containerRef} className="relative flex" style={{ height: `${24 * PIXELS_PER_HOUR}px` }}>
              {dates.map((date, dayIndex) => (
                <div
                  key={dayIndex}
                  className="border-r last:border-r-0 relative flex-shrink-0"
                  style={{ width: '200px' }}
                  onPointerDown={(e) => handleSlotPointerDown(e, dayIndex)}
                  onDoubleClick={(e) => handleDoubleClick(e, dayIndex)}
                >
                  {/* Hour grid lines */}
                  {hours.map(hour => (
                    <div
                      key={hour}
                      className="border-b border-border/20"
                      style={{ height: `${PIXELS_PER_HOUR}px` }}
                    />
                  ))}

                  {/* Events for this day */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="relative h-full pointer-events-auto">
                      {events
                        .filter(event => {
                          const eventDate = new Date(event.startTime);
                          return !event.allDay && eventDate.toDateString() === date.toDateString();
                        })
                        .map(event => (
                          <CalendarEventComponent
                            key={event.id}
                            event={event}
                            onUpdate={handleEventUpdate}
                            onDelete={handleEventDelete}
                            gridTop={gridTop}
                            allDates={dates}
                            currentDayIndex={dayIndex}
                          />
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekCalendar;
