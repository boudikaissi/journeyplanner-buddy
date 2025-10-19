# Calendar Component

A fully self-contained, interactive calendar component for React with drag-and-drop event management, all-day event support, and week view.

## Features

- 📅 Week view with customizable date ranges
- 🎯 Drag and drop events to reschedule
- ⏱️ Resize events to adjust duration
- 🌅 All-day event support
- ✏️ Click to edit event details
- 💾 LocalStorage persistence
- 📱 Responsive design with Tailwind CSS

## Installation

### 1. Copy the Calendar Folder

Copy the entire `calendar` folder into your project's `src/components/` directory.

### 2. Install Required NPM Dependencies

```bash
npm install @radix-ui/react-dialog \
            @radix-ui/react-label \
            @radix-ui/react-select \
            @radix-ui/react-checkbox \
            @radix-ui/react-switch \
            @radix-ui/react-popover \
            @radix-ui/react-scroll-area \
            @radix-ui/react-slot \
            lucide-react \
            class-variance-authority \
            clsx \
            tailwind-merge
```

### 3. Tailwind CSS Configuration

Ensure your `tailwind.config.js` includes the calendar components in the content array:

```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Make sure you have these CSS variables defined in your index.css
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 4. CSS Variables

Add these CSS variables to your `src/index.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

## Usage

### Basic Example

```tsx
import TripTimeline from "./components/calendar/TripTimeline";

function App() {
  return (
    <TripTimeline
      tripId="my-trip-123"
      startDate="2024-03-15"
      endDate="2024-03-20"
    />
  );
}
```

### Props

#### TripTimeline Component

| Prop | Type | Description |
|------|------|-------------|
| `tripId` | `string` | Unique identifier for the trip (used for localStorage) |
| `startDate` | `string` | Start date in YYYY-MM-DD format |
| `endDate` | `string` | End date in YYYY-MM-DD format |

### Event Data Structure

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  category?: string;
  location?: string;
  description?: string;
  allDay?: boolean;
}
```

## Features in Detail

### Creating Events

- Click the "Add Event" button to open the creation dialog
- Double-click on any time slot to create an event quickly
- Drag on a time slot to create an event with a specific duration

### Editing Events

- Click any event to open the edit dialog
- Modify title, location, date, and time
- Toggle all-day status
- Delete events

### Moving Events

- Click and drag any event to move it to a different time
- Events snap to 15-minute intervals
- Events automatically move between days when dragged

### Resizing Events

- Hover over the top or bottom edge of an event
- Click and drag to resize the event duration
- Minimum duration is 15 minutes

### All-Day Events

- Check "All Day" when creating or editing an event
- All-day events appear in a dedicated row at the top of the calendar

### Data Persistence

- Events are automatically saved to localStorage
- Data persists between page refreshes
- Each trip has its own isolated event storage

## Customization

### Styling

The calendar uses Tailwind CSS utility classes. You can customize the appearance by:

1. Modifying the CSS variables in your `index.css`
2. Adjusting the Tailwind classes in the component files
3. Extending the theme in your `tailwind.config.js`

### Time Slots

Edit `src/components/calendar/utils.ts` to change the time slot configuration:

```typescript
export const PIXELS_PER_HOUR = 60; // Height of each hour in pixels
export const MINUTES_PER_SLOT = 15; // Snap to 15-minute intervals
```

### Default Events

Modify the default events in `TripTimeline.tsx`:

```typescript
const loadEventsFromStorage = (): CalendarEvent[] => {
  // ... existing code ...
  return [
    // Add your default events here
  ];
};
```

## File Structure

```
calendar/
├── README.md                  # This file
├── lib/
│   └── utils.ts              # Utility functions (cn helper)
├── ui/                       # Shadcn UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── checkbox.tsx
│   ├── dialog.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── popover.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   └── switch.tsx
├── AllDayEvent.tsx           # All-day event component
├── Calendar.tsx              # Main calendar grid
├── CalendarEvent.tsx         # Individual event component
├── CalendarGrid.tsx          # Calendar grid layout
├── CreateEventDialog.tsx     # Event creation dialog
├── TimePickerInput.tsx       # Time input component
├── TripTimeline.tsx          # Main timeline component
├── WeekCalendar.tsx          # Week view component
├── types.ts                  # TypeScript interfaces
└── utils.ts                  # Calendar utility functions
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This component is part of your project and follows your project's license.

## Credits

Built with:
- [React](https://react.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
