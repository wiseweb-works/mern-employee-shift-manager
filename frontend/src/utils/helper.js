import moment from "moment-timezone";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getPreviousMonth = (day) => {
  const date = moment(day, "yyyy-MM-DD");
  const previousMonth = date.clone().subtract(1, "month").format("yyyy-MM-DD");
  return previousMonth;
};

export const getNextMonth = (day) => {
  const date = moment(day, "yyyy-MM-DD");
  const nextMonth = date.clone().add(1, "month").format("yyyy-MM-DD");
  return nextMonth;
};

export const genareteWeeklySummary = (filteredEvents) => {
  const result = [
    { weekday: "Montag", morning: 0, evening: 0 },
    { weekday: "Dienstag", morning: 0, evening: 0 },
    { weekday: "Mittwoch", morning: 0, evening: 0 },
    { weekday: "Donnerstag", morning: 0, evening: 0 },
    { weekday: "Freitag", morning: 0, evening: 0 },
    { weekday: "Samstag", morning: 0, evening: 0 },
    { weekday: "Sonntag", morning: 0, evening: 0 },
  ];

  filteredEvents?.forEach((event) => {
    const weekdayIndex = moment(event.start).isoWeekday() - 1;

    if (event.start.endsWith("08:00")) {
      result[weekdayIndex].morning += 1;
    } else if (event.start.endsWith("13:30")) {
      result[weekdayIndex].evening += 1;
    }
  });

  return result;
};
