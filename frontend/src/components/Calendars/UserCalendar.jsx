import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import "@schedule-x/theme-default/dist/index.css";
import { viewWeek, viewDay, viewMonthGrid } from "@schedule-x/calendar";

const UserCalendar = ({ events }) => {
  const calendar = useCalendarApp({
    locale: "de-DE",
    defaultView: viewMonthGrid.name,
    skipValidation: true,
    monthGridOptions: {
      nEventsPerDay: 16,
    },
    dayBoundaries: {
      start: "07:00",
      end: "23:00",
    },
    showWeekNumbers: true,
    events: events,
    views: [viewWeek, viewDay, viewMonthGrid],
  });
  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
};

export default UserCalendar;
