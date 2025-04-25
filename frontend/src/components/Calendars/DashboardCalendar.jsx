import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/index.css";

const DashboardCalendar = ({
  events,
  views,
  day = null,
  handleShiftUpdate,
  editMode,
  handleClick,
}) => {
  const calendar = useCalendarApp({
    calendars: {
      sozialarbeiter: {
        colorName: "leisure",
        lightColors: {
          main: "#1c7df9",
          container: "#d2e7ff",
          onContainer: "#002859",
        },
        darkColors: {
          main: "#c0dfff",
          onContainer: "#dee6ff",
          container: "#426aa2",
        },
      },
      sozialbetreuer: {
        colorName: "work",
        lightColors: {
          main: "#f91c45",
          container: "#ffd2dc",
          onContainer: "#59000d",
        },
        darkColors: {
          main: "#ffc0cc",
          onContainer: "#ffdee6",
          container: "#a24258",
        },
      },
      sozialbetreuerhelfer: {
        colorName: "personal",
        lightColors: {
          main: "#efb100",
          container: "#fff5aa",
          onContainer: "#594800",
        },
        darkColors: {
          main: "#fff5c0",
          onContainer: "#fff5de",
          container: "#a29742",
        },
      },
    },
    locale: "de-DE",
    selectedDate: day,
    views: views,
    skipValidation: true,
    monthGridOptions: {
      nEventsPerDay: 18,
    },
    dayBoundaries: {
      start: "07:00",
      end: "23:00",
    },
    showWeekNumbers: true,
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
    events: events,
    callbacks: {
      onEventUpdate(updatedEvent) {
        if (editMode) handleShiftUpdate(updatedEvent);
      },
      onEventClick(calendarEvent) {
        if (editMode) handleClick(calendarEvent);
      },
    },
  });
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default DashboardCalendar;
