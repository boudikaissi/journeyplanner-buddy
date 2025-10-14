import { useState } from 'react';
import { CalendarEvent } from './types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import TimePickerInput from './TimePickerInput';
import { formatTime, setTimeInMinutes } from './utils';

interface AllDayEventProps {
  event: CalendarEvent;
  onUpdate: (eventId: string, updates: { startTime?: Date; endTime?: Date; title?: string; location?: string; allDay?: boolean }) => void;
  onDelete: (eventId: string) => void;
}

const AllDayEvent = ({ event, onUpdate, onDelete }: AllDayEventProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(event.title);
  const [editLocation, setEditLocation] = useState(event.location || '');
  const [editStartTime, setEditStartTime] = useState(formatTime(event.startTime));
  const [editEndTime, setEditEndTime] = useState(formatTime(event.endTime));
  const [editAllDay, setEditAllDay] = useState(event.allDay || false);

  const handleClick = () => {
    setIsEditing(true);
    setEditTitle(event.title);
    setEditLocation(event.location || '');
    setEditStartTime(formatTime(event.startTime));
    setEditEndTime(formatTime(event.endTime));
    setEditAllDay(event.allDay || false);
  };

  const handleSaveEdit = () => {
    const parseTime = (timeStr: string, baseDate: Date): Date => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return baseDate;
      
      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const period = match[3].toUpperCase();
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      return setTimeInMinutes(baseDate, hours * 60 + minutes);
    };

    const newStartTime = editAllDay ? event.startTime : parseTime(editStartTime, event.startTime);
    const newEndTime = editAllDay ? event.endTime : parseTime(editEndTime, event.endTime);

    onUpdate(event.id, {
      title: editTitle,
      location: editLocation,
      startTime: newStartTime,
      endTime: newEndTime,
      allDay: editAllDay
    });
    
    setIsEditing(false);
  };

  return (
    <>
      <div
        className="text-xs px-2 py-1 rounded bg-primary/10 border border-primary/20 truncate cursor-pointer hover:bg-primary/20"
        onClick={handleClick}
      >
        {event.title}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent 
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSaveEdit();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Event title"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                placeholder="Event location (optional)"
              />
            </div>
            <div className="flex items-center justify-between py-2">
              <Label htmlFor="all-day" className="cursor-pointer">All Day</Label>
              <Switch
                id="all-day"
                checked={editAllDay}
                onCheckedChange={setEditAllDay}
              />
            </div>
            {!editAllDay && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <TimePickerInput
                    value={editStartTime}
                    onChange={setEditStartTime}
                    placeholder="Select start time"
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <TimePickerInput
                    value={editEndTime}
                    onChange={setEditEndTime}
                    placeholder="Select end time"
                  />
                </div>
              </div>
            )}
            <div className="flex justify-between gap-2">
              <Button 
                variant="destructive" 
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete(event.id);
                  setIsEditing(false);
                }}
              >
                Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setIsEditing(false);
                }}>
                  Cancel
                </Button>
                <Button onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleSaveEdit();
                }}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AllDayEvent;
