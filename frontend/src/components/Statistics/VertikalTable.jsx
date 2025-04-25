import moment from "moment-timezone";

const DAYS = ["", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const VertikalTable = ({ selectedMonth, handleFilter, filteredEvents }) => {
  return (
    <table className="table-auto border-collapse w-full text-sm">
      <thead>
        <tr>
          <th className="border px-2 py-1 bg-gray-100">Datum</th>
          {[...Array(moment(selectedMonth).daysInMonth())].map((_, i) => (
            <th key={i} className="border px-2 py-1 bg-gray-100 text-center">
              {String(i + 1).padStart(2, "0")}
            </th>
          ))}
          <th className="border px-2 py-1 bg-gray-100 text-center">#</th>
        </tr>
        <tr>
          <th className="border px-2 py-1 bg-gray-100">Tag</th>
          {[...Array(moment(selectedMonth).daysInMonth())].map((_, i) => (
            <th
              key={i}
              className={`border px-2 py-1 ${
                DAYS[
                  moment(selectedMonth)
                    .startOf("month")
                    .add(i, "day")
                    .isoWeekday()
                ] === "Sa" ||
                DAYS[
                  moment(selectedMonth)
                    .startOf("month")
                    .add(i, "day")
                    .isoWeekday()
                ] === "So"
                  ? "bg-gray-400"
                  : "bg-gray-100"
              }  text-center`}
            >
              {
                DAYS[
                  moment(selectedMonth)
                    .startOf("month")
                    .add(i, "day")
                    .isoWeekday()
                ]
              }
            </th>
          ))}
          <th className="border px-2 py-1 bg-gray-100 text-center">Count</th>
        </tr>
      </thead>
      <tbody>
        {handleFilter()?.map((user) => (
          <tr key={user._id}>
            <td className="border px-2 py-1 font-semibold bg-gray-50 text-center">
              <span
                className={`${
                  user?.team === "sozialarbeiter"
                    ? "text-blue-500"
                    : user?.team === "sozialbetreuer"
                    ? "text-red-500"
                    : "text-yellow-600"
                }`}
              >
                {user?.name}
              </span>
            </td>

            {Array.from(
              { length: moment(selectedMonth).daysInMonth() },
              (_, i) => i + 1
            ).map((day, index) => (
              <td
                key={index}
                className={`border px-2 py-1 font-semibold text-center ${(() => {
                  const eventForDay = filteredEvents
                    .filter((event) => event.employee._id === user._id)
                    .find((event) => {
                      const dd = moment(event.start).format("DD");
                      const hour = moment(event.start).format("HH:mm");
                      return dd == day && (hour == "08:00" || hour == "13:30");
                    });

                  if (eventForDay) {
                    const hour = moment(eventForDay.start).format("HH:mm");
                    if (hour === "08:00") return "bg-yellow-100";
                    if (hour === "13:30") return "bg-purple-100";
                  }
                  return "bg-gray-50";
                })()}
    `}
              >
                {(() => {
                  const eventForDay = filteredEvents
                    .filter((event) => event.employee._id === user._id)
                    .find((event) => {
                      const dd = moment(event.start).format("DD");
                      const hour = moment(event.start).format("HH:mm");
                      return dd == day && (hour == "08:00" || hour == "13:30");
                    });

                  if (eventForDay) {
                    const hour = moment(eventForDay.start).format("HH:mm");
                    if (hour === "08:00") return "Früh";
                    if (hour === "13:30") return "Spät";
                  }

                  return "";
                })()}
              </td>
            ))}
            <td className="border px-2 py-1 font-semibold text-center bg-green-100">
              {
                filteredEvents.filter(
                  (event) => event.employee._id === user._id
                ).length
              }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VertikalTable;
