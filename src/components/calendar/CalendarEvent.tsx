import { useRef, useState, useCallback, useEffect } from 'react';
import { CalendarEvent } from './types';
import {
  getTimeInMinutes,
  minutesToPixels,
  pixelsToMinutes,
  snapToSlot,
  setTimeInMinutes,
  formatTime,
  clampMinutes,
  getDuration,
  PIXELS_PER_HOUR
} from './utils';
import { cn } from '@/lib/utils';

interface CalendarEventProps {
  event: CalendarEvent;
  onUpdate: (eventId: string, updates: { startTime?: Date; endTime?: Date }) => void;
  gridTop: number;
}

const CalendarEventComponent = ({ event, onUpdate, gridTop }: CalendarEventProps) => {
  const eventRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'move' | 'resize-top' | 'resize-bottom' | null>(null);
  const [tempStartTime, setTempStartTime] = useState<Date>(event.startTime);
  const [tempEndTime, setTempEndTime] = useState<Date>(event.endTime);

  // Reset temp times when event prop changes
  useEffect(() => {
    setTempStartTime(event.startTime);
    setTempEndTime(event.endTime);
  }, [event.startTime, event.endTime]);

  const startMinutes = getTimeInMinutes(tempStartTime);
  const endMinutes = getTimeInMinutes(tempEndTime);
  const duration = endMinutes - startMinutes;

  const top = minutesToPixels(startMinutes);
  const height = minutesToPixels(duration);

  const handlePointerDown = useCallback((e: React.PointerEvent, type: 'move' | 'resize-top' | 'resize-bottom') => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsDragging(true);
    setDragType(type);

    const startY = e.clientY;
    const initialStartTime = new Date(tempStartTime);
    const initialEndTime = new Date(tempEndTime);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaMinutes = snapToSlot(pixelsToMinutes(deltaY));

      if (type === 'move') {
        const newStartMinutes = clampMinutes(getTimeInMinutes(initialStartTime) + deltaMinutes);
        const newEndMinutes = clampMinutes(getTimeInMinutes(initialEndTime) + deltaMinutes);
        
        setTempStartTime(setTimeInMinutes(event.startTime, newStartMinutes));
        setTempEndTime(setTimeInMinutes(event.endTime, newEndMinutes));
      } else if (type === 'resize-top') {
        const newStartMinutes = clampMinutes(getTimeInMinutes(initialStartTime) + deltaMinutes);
        const currentEndMinutes = getTimeInMinutes(initialEndTime);
        
        // Ensure minimum 15 minutes duration
        if (currentEndMinutes - newStartMinutes >= 15) {
          setTempStartTime(setTimeInMinutes(event.startTime, newStartMinutes));
        }
      } else if (type === 'resize-bottom') {
        const newEndMinutes = clampMinutes(getTimeInMinutes(initialEndTime) + deltaMinutes);
        const currentStartMinutes = getTimeInMinutes(initialStartTime);
        
        // Ensure minimum 15 minutes duration
        if (newEndMinutes - currentStartMinutes >= 15) {
          setTempEndTime(setTimeInMinutes(event.endTime, newEndMinutes));
        }
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setDragType(null);
      
      // Commit changes
      onUpdate(event.id, {
        startTime: tempStartTime,
        endTime: tempEndTime
      });

      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  }, [event, tempStartTime, tempEndTime, onUpdate]);

  return (
    <div
      ref={eventRef}
      className={cn(
        "absolute inset-x-2 rounded-md border border-primary/20 bg-primary/10 overflow-hidden transition-shadow",
        isDragging ? "shadow-lg ring-2 ring-primary/30" : "hover:shadow-md hover:border-primary/40",
        dragType === 'move' && "cursor-move",
        dragType === 'resize-top' && "cursor-ns-resize",
        dragType === 'resize-bottom' && "cursor-ns-resize"
      )}
      style={{
        top: `${top}px`,
        height: `${Math.max(height, 15)}px`
      }}
    >
      {/* Resize handle - top */}
      <div
        className="absolute inset-x-0 top-0 h-1 cursor-ns-resize hover:bg-primary/30 transition-colors"
        onPointerDown={(e) => handlePointerDown(e, 'resize-top')}
      />

      {/* Event content */}
      <div
        className="px-2 py-1 h-full overflow-hidden cursor-move select-none"
        onPointerDown={(e) => handlePointerDown(e, 'move')}
      >
        <div className="text-xs font-medium text-primary truncate">
          {event.title}
        </div>
        <div className="text-xs text-muted-foreground">
          {formatTime(tempStartTime)} - {formatTime(tempEndTime)}
        </div>
        {event.location && height > 40 && (
          <div className="text-xs text-muted-foreground truncate mt-0.5">
            {event.location}
          </div>
        )}
      </div>

      {/* Resize handle - bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-1 cursor-ns-resize hover:bg-primary/30 transition-colors"
        onPointerDown={(e) => handlePointerDown(e, 'resize-bottom')}
      />
    </div>
  );
};

export default CalendarEventComponent;
