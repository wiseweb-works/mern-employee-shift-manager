import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/index.css";

const ShiftCalendar = ({
  events,
  views,
  selectedDay = null,
  handleShiftUpdate,
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
    },
    locale: "de-DE",
    selectedDate: selectedDay,
    views: views,
    skipValidation: true,
    monthGridOptions: {
      nEventsPerDay: 16,
    },
    dayBoundaries: {
      start: "07:00",
      end: "23:00",
    },
    callbacks: {
      onEventUpdate(updatedEvent) {
        handleShiftUpdate(updatedEvent);
      },
      onEventClick(calendarEvent) {
        console.log("onEventClick", calendarEvent);
      },
    },
    showWeekNumbers: true,
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
    events: events,
  });
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default ShiftCalendar;
