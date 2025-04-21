import moment from "moment";
import { useEffect, useState } from "react";
import { RiResetLeftFill } from "react-icons/ri";

const AdminShiftTable = ({ selectedMonth, users, filteredEvents }) => {
  const [teamFilter, setTeamFilter] = useState("all");
  const [workFilter, setWorkFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFilter = () => {
    let filtered = users;
    if (teamFilter !== "all") {
      filtered = filtered.filter((user) => user.team === teamFilter);
    } else {
      filtered = filtered.filter((user) => user.team);
    }
    if (workFilter !== "all") {
      filtered = filtered.filter((user) => user.workType === workFilter);
    } else {
      filtered = filtered.filter((user) => user.workType);
    }
    if (activeFilter === "active") {
      filtered = filtered.filter((user) => user.isActive);
    } else if (activeFilter === "deactive") {
      filtered = filtered.filter((user) => !user.isActive);
    } else {
      filtered = filtered.filter((user) => user.isActive !== "");
    }
    return filtered;
  };

  const handleReset = () => {
    setTeamFilter("all");
    setWorkFilter("all");
    setActiveFilter("all");
  };

  useEffect(() => {
    handleFilter();
  }, [teamFilter, workFilter, activeFilter]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <span className="select-boxx">{`Count: ${
          handleFilter()?.length
        }`}</span>
        <select
          className="select-boxx"
          onChange={(e) => setTeamFilter(e.target.value)}
          value={teamFilter}
        >
          <option value="all">Team</option>
          <option value="sozialarbeiter">Sozialarbeiter</option>
          <option value="sozialbetreuer">Sozialbetreuer</option>
        </select>
        <select
          className="select-boxx"
          onChange={(e) => setWorkFilter(e.target.value)}
          value={workFilter}
        >
          <option value="all">Work Type</option>
          <option value="full-time">Full-Time</option>
          <option value="part-time">Part-Time</option>
        </select>
        <select
          className="select-boxx"
          onChange={(e) => setActiveFilter(e.target.value)}
          value={activeFilter}
        >
          <option value="all">Active/Deactive</option>
          <option value="active">Active</option>
          <option value="deactive">Deactive</option>
        </select>
        {(teamFilter !== "all" || workFilter !== "all") && (
          <button
            className="flex md:flex download-btn shadow-sm"
            onClick={handleReset}
          >
            <RiResetLeftFill className="text-lg" />
            Reset
          </button>
        )}
      </div>
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
          {handleFilter()?.map((user) => (
            <tr key={user._id}>
              <td className="border px-2 py-1 font-semibold bg-gray-50 text-center">
                <span
                  className={`${
                    user?.team === "sozialarbeiter"
                      ? "text-blue-500"
                      : user?.workType === "part-time"
                      ? "text-yellow-600"
                      : "text-red-500"
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
                        return (
                          dd == day && (hour == "08:00" || hour == "13:30")
                        );
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
                        return (
                          dd == day && (hour == "08:00" || hour == "13:30")
                        );
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
          ))}
        </tbody>
      </table>
    </>
  );
};

export default AdminShiftTable;
