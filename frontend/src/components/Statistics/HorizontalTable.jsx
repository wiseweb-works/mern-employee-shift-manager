import moment from "moment";

const HorizontalTable = ({ selectedMonth, handleFilter, filteredEvents }) => {
  return (
    <table className="table-auto border-collapse w-full text-sm">
      <thead>
        <tr>
          <th className="border px-2 py-1 bg-gray-100">#</th>
          {handleFilter()?.map((user) => (
            <th
              key={user._id}
              className="border px-2 py-1 bg-gray-100 text-center"
            >
              {user?.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from(
          { length: moment(selectedMonth).daysInMonth() },
          (_, i) => i + 1
        ).map((day, index) => (
          <tr key={index}>
            <td className="border px-2 py-1 font-semibold bg-gray-50 text-center">
              {String(day).padStart(2, "0")}
            </td>
            {handleFilter()?.map((user) => (
              <td
                key={user._id}
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
                })()}`}
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
          </tr>
        ))}
        <tr>
          <td className="border px-2 py-1 font-semibold text-center bg-gray-100">
            Count
          </td>
          {handleFilter()?.map((user) => (
            <td
              key={user._id}
              className="border px-2 py-1 font-semibold text-center bg-green-100"
            >
              {
                filteredEvents.filter(
                  (event) => event.employee._id === user._id
                ).length
              }
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default HorizontalTable;
