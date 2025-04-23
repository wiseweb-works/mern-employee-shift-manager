import { viewDay, viewMonthAgenda, viewMonthGrid } from "@schedule-x/calendar";
import DashboardCalendar from "./DashboardCalendar";

const CalendarSelector = ({
  events,
  setEvents,
  handleShiftUpdate,
  handleClick,
  editMode,
  teamFilter,
}) => {
  return (
    <>
      {events?.length > 0 && !editMode && teamFilter === "sozialarbeiter" && (
        <DashboardCalendar
          events={events.filter((event) => event.calendarId === teamFilter)}
          setEvents={setEvents}
          views={[viewMonthAgenda]}
          editMode={editMode}
        />
      )}

      {events?.length > 0 && !editMode && teamFilter === "sozialbetreuer" && (
        <DashboardCalendar
          events={events.filter((event) => event.calendarId === teamFilter)}
          setEvents={setEvents}
          views={[viewMonthAgenda]}
          editMode={editMode}
        />
      )}

      {events?.length > 0 &&
        !editMode &&
        teamFilter === "sozialbetreuerhelfer" && (
          <DashboardCalendar
            events={events.filter((event) => event.calendarId === teamFilter)}
            setEvents={setEvents}
            views={[viewMonthAgenda]}
            editMode={editMode}
          />
        )}

      {events?.length > 0 && !editMode && teamFilter === "all" && (
        <DashboardCalendar
          events={events}
          setEvents={setEvents}
          views={[viewMonthAgenda]}
          editMode={editMode}
        />
      )}

      {/*  */}

      {events?.length > 0 && editMode && teamFilter === "sozialarbeiter" && (
        <DashboardCalendar
          events={events.filter((event) => event.calendarId === teamFilter)}
          setEvents={setEvents}
          views={[viewMonthGrid, viewDay]}
          editMode={editMode}
          handleClick={handleClick}
          handleShiftUpdate={handleShiftUpdate}
        />
      )}

      {events?.length > 0 && editMode && teamFilter === "sozialbetreuer" && (
        <DashboardCalendar
          events={events.filter((event) => event.calendarId === teamFilter)}
          setEvents={setEvents}
          views={[viewMonthGrid, viewDay]}
          editMode={editMode}
          handleClick={handleClick}
          handleShiftUpdate={handleShiftUpdate}
        />
      )}

      {events?.length > 0 &&
        editMode &&
        teamFilter === "sozialbetreuerhelfer" && (
          <DashboardCalendar
            events={events.filter((event) => event.calendarId === teamFilter)}
            setEvents={setEvents}
            views={[viewMonthGrid, viewDay]}
            editMode={editMode}
            handleClick={handleClick}
            handleShiftUpdate={handleShiftUpdate}
          />
        )}

      {events?.length > 0 && editMode && teamFilter === "all" && (
        <DashboardCalendar
          events={events}
          setEvents={setEvents}
          views={[viewMonthGrid, viewDay]}
          editMode={editMode}
          handleClick={handleClick}
          handleShiftUpdate={handleShiftUpdate}
        />
      )}
    </>
  );
};

export default CalendarSelector;
