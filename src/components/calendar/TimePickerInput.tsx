import { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock } from 'lucide-react';

interface TimePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TimePickerInput = ({ value, onChange, placeholder = "Select time" }: TimePickerInputProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate all 15-minute increment times
  const timeOptions = useMemo(() => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'AM' : 'PM';
        const minuteStr = minute.toString().padStart(2, '0');
        options.push(`${hour12}:${minuteStr} ${period}`);
      }
    }
    return options;
  }, []);

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchValue.trim()) return timeOptions;

    const search = searchValue.trim().toLowerCase();
    
    // Check if it's just a number (for smart AM/PM suggestions)
    const numberMatch = search.match(/^(\d{1,2})$/);
    if (numberMatch) {
      const num = parseInt(numberMatch[1]);
      if (num >= 1 && num <= 12) {
        // Show both AM and PM options for this hour
        return timeOptions.filter(option => {
          const hourMatch = option.match(/^(\d{1,2}):/);
          return hourMatch && parseInt(hourMatch[1]) === num;
        });
      }
    }

    // Regular search/filter
    return timeOptions.filter(option => 
      option.toLowerCase().includes(search)
    );
  }, [searchValue, timeOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setOpen(true);
  };

  const handleSelectTime = (time: string) => {
    onChange(time);
    setSearchValue('');
    setOpen(false);
  };

  const displayValue = value || searchValue;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          onClick={() => {
            setOpen(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          <span className={displayValue ? "" : "text-muted-foreground"}>
            {displayValue || placeholder}
          </span>
          <Clock className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-2">
          <Input
            ref={inputRef}
            placeholder="Type time..."
            value={searchValue}
            onChange={handleInputChange}
            className="h-8"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <ScrollArea className="h-[200px]">
          <div className="p-1">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No times found
              </div>
            ) : (
              filteredOptions.map((time) => (
                <Button
                  key={time}
                  variant="ghost"
                  className="w-full justify-start font-normal h-8 px-2"
                  onClick={() => handleSelectTime(time)}
                >
                  {time}
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default TimePickerInput;
