import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  viewWeek,
  viewDay,
  viewMonthGrid,
  viewMonthAgenda,
} from "@schedule-x/calendar";
import { createEventModalPlugin } from "@schedule-x/event-modal";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-default/dist/index.css";
import moment from "moment";
import createMockData from "../helpers/createMockData";

const eventss = createMockData();

const Calendar = () => {
  const today = moment().format("YYYY-MM-DD");
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
    selectedDate: today,
    views: [viewMonthGrid],
    skipValidation: true,
    monthGridOptions: {
      nEventsPerDay: 16,
    },
    showWeekNumbers: true,
    plugins: [createEventModalPlugin(), createDragAndDropPlugin()],
    events: eventss,
    callbacks: {
      onEventUpdate(updatedEvent) {
        console.log("onEventUpdate", updatedEvent);
      },
      onEventClick(calendarEvent) {
        console.log("onEventClick", calendarEvent);
      },
    },
  });
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default Calendar;
