import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import moment from "moment";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AdminShiftTable from "../../components/Statistics/AdminShiftTable";
import { getNextMonth, getPreviousMonth } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { formatToLocalTime } from "../../utils/formatToLocalTime";
import { FaPrint } from "react-icons/fa";

const AdminStatistics = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const getAllShifts = async () => {
    try {
      const result = await axiosInstance.get(API_PATH.SHIFTS.GET_SHIFTS);
      if (result?.data?.shifts?.length > 0) {
        const formattedShiftDataArray = result.data.shifts.map((shift) => ({
          ...shift,
          id: shift._id,
          start: formatToLocalTime(shift.start),
          end: formatToLocalTime(shift.end),
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
      console.log(error);
    }
  };

  const getAllUser = async () => {
    try {
      const result = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (result?.data?.users?.length > 0) {
        setUsers(result.data.users);
      }
    } catch (error) {
      console.log(error);
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
    getAllUser();
    return () => {};
  }, []);

  useEffect(() => {
    const filtered = handleFilter();
    setFilteredEvents(filtered);
    return () => {};
  }, [events, selectedMonth]);

  return (
    <DashboardLayout activeMenu="View Statistics">
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-3 bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">
            Monthly Shift Summary:
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
                aria-label="Left"
              />
            </button>

            <div className="bg-yellow-100 rounded-2xl p-4 shadow-md flex-3 ">
              <p className="text-lg font-medium">Morning Shifts</p>
              <p className="text-3xl font-bold text-yellow-600">
                {
                  filteredEvents.filter((event) =>
                    String(event.start).endsWith("08:00")
                  ).length
                }
              </p>
            </div>
            <div className="bg-blue-100 rounded-2xl p-4 shadow-md flex-3 ">
              <p className="text-lg font-medium">Total Shift</p>
              <p className="text-3xl font-bold text-blue-600">
                {filteredEvents.length}
              </p>
            </div>
            <div className="bg-purple-100 rounded-2xl p-4 shadow-md flex-3">
              <p className="text-lg font-medium">Night Shifts</p>
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
                aria-label="Right"
              />
            </button>
          </div>
        </div>
        <div className="print-area col-span-1 md:col-span-3 bg-white rounded-2xl shadow-md p-4 overflow-auto print:overflow-visible">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Shift Chart{" "}
              <span className="text-red-500">
                {" "}
                {moment(selectedMonth).format("MM/yyyy")}
              </span>
            </h2>
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full shadow"
            >
              <FaPrint />
            </button>
          </div>

          <AdminShiftTable
            users={users}
            selectedMonth={selectedMonth}
            filteredEvents={filteredEvents}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStatistics;
