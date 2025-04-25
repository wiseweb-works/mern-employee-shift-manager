import moment from "moment-timezone";

const UserShiftTable = ({ selectedMonth, user, filteredEvents }) => {
  return (
    <table className="table-auto border-collapse w-full text-sm">
      <thead>
        <tr>
          <th className="border px-2 py-1 bg-gray-100">#</th>
          {[...Array(moment(selectedMonth).daysInMonth())].map((_, i) => (
            <th key={i} className="border px-2 py-1 bg-gray-100 text-center">
              {String(i + 1).padStart(2, "0")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-2 py-1 font-semibold bg-gray-50 text-center">
            {user?.name}
          </td>

          {Array.from(
            { length: moment(selectedMonth).daysInMonth() },
            (_, i) => i + 1
          ).map((day, index) => (
            <td
              key={index}
              className={`border px-2 py-1 font-semibold text-center ${(() => {
                const eventForDay = filteredEvents.find((event) => {
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
                const eventForDay = filteredEvents.find((event) => {
                  const dd = moment(event.start).format("DD");
                  const hour = moment(event.start).format("HH:mm");
                  return dd == day && (hour == "08:00" || hour == "13:30");
                });

                if (eventForDay) {
                  const hour = moment(eventForDay.start).format("HH:mm");
                  if (hour === "08:00") return "F";
                  if (hour === "13:30") return "S";
                }

                return "";
              })()}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default UserShiftTable;
