import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import DashboardLayout from "../../components/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import moment from "moment-timezone";
import { UserContext } from "../../context/UserContext";
import UserShiftTable from "../../components/Statistics/UserShiftTable";
import {
  genareteWeeklySummary,
  getNextMonth,
  getPreviousMonth,
} from "../../utils/helper";
import toast from "react-hot-toast";

const ViewStatistics = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { user } = useContext(UserContext);

  const weeklyShiftSummary = genareteWeeklySummary(filteredEvents);

  const getAllShifts = async () => {
    try {
      const result = await axiosInstance.get(API_PATH.SHIFTS.GET_SHIFTS);
      if (result?.data?.shifts?.length > 0) {
        const formattedShiftDataArray = result.data.shifts.map((shift) => ({
          ...shift,
          id: shift._id,
          start: moment(shift.start).tz("Europe/Berlin").format(),
          end: moment(shift.end).tz("Europe/Berlin").format(),
          title: shift.employee.name,
          calendarId:
            shift.employee.workType === "part-time"
              ? "partTime"
              : shift.employee.team,
          uid: shift.employee._id,
          description: shift.notes,
        }));
        setEvents(formattedShiftDataArray);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleLeftClick = () => {
    setSelectedMonth(getPreviousMonth(selectedMonth));
  };

  const handleRightClick = () => {
    setSelectedMonth(getNextMonth(selectedMonth));
  };

  const handleFilter = () => {
    const filtered = events.filter(
      (event) =>
        moment(event.start).isSameOrAfter(
          moment(selectedMonth).startOf("month")
        ) &&
        moment(event.start).isBefore(
          moment(selectedMonth).add(1, "month").startOf("month")
        )
    );
    return filtered;
  };

  useEffect(() => {
    getAllShifts();
    return () => {};
  }, []);

  useEffect(() => {
    setFilteredEvents(handleFilter());
    return () => {};
  }, [events, selectedMonth]);

  return (
    <DashboardLayout activeMenu="Statistiken anzeigen">
      {events?.length > 0 && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-3 bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">
              Monatliche Schichtübersicht:
              <span className="text-red-500">
                {" "}
                {moment(selectedMonth).format("MM/yyyy")}
              </span>
            </h2>
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <button onClick={handleLeftClick}>
                <FaChevronLeft
                  size={40}
                  className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full shadow transition"
                  aria-label="Links"
                />
              </button>

              <div className="bg-yellow-100 rounded-2xl p-4 shadow-md flex-3 ">
                <p className="text-lg font-medium">Frühschichten</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {
                    filteredEvents.filter((event) =>
                      String(event.start).endsWith("08:00")
                    ).length
                  }
                </p>
              </div>
              <div className="bg-blue-100 rounded-2xl p-4 shadow-md flex-3 ">
                <p className="text-lg font-medium">Gesamte Schichten</p>
                <p className="text-3xl font-bold text-blue-600">
                  {filteredEvents.length}
                </p>
              </div>
              <div className="bg-purple-100 rounded-2xl p-4 shadow-md flex-3">
                <p className="text-lg font-medium">Spätschichten</p>
                <p className="text-3xl font-bold text-purple-600">
                  {
                    filteredEvents.filter((event) =>
                      String(event.start).endsWith("13:30")
                    ).length
                  }
                </p>
              </div>
              <button onClick={handleRightClick}>
                <FaChevronRight
                  size={40}
                  className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full shadow transition"
                  aria-label="Rechts"
                />
              </button>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 bg-white rounded-2xl shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Diagramme</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-2/3 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyShiftSummary} barCategoryGap={20}>
                    <XAxis dataKey="weekday" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="morning" fill="#facc15" name="Früh" />
                    <Bar dataKey="evening" fill="#a78bfa" name="Spät" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full md:w-1/3 h-72 border-l-2 border-l-black">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Früh",
                          value: filteredEvents.filter((event) =>
                            String(event.start).endsWith("08:00")
                          ).length,
                        },
                        {
                          name: "Spät",
                          value: filteredEvents.filter((event) =>
                            String(event.start).endsWith("13:30")
                          ).length,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      <Cell key="cell-0" fill="#facc15" />
                      <Cell key="cell-1" fill="#a78bfa" />
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 bg-white rounded-2xl shadow-md p-4 overflow-auto">
            <h2 className="text-xl font-semibold mb-4">
              Monatliche Schichtübersicht
            </h2>
            <UserShiftTable
              user={user}
              selectedMonth={selectedMonth}
              filteredEvents={filteredEvents}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ViewStatistics;
