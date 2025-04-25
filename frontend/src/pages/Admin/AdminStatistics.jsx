import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import moment from "moment";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import AdminShiftTable from "../../components/Statistics/AdminShiftTable";
import { getNextMonth, getPreviousMonth } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { FaPrint } from "react-icons/fa";
import toast from "react-hot-toast";

const AdminStatistics = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const getAllShifts = async () => {
    try {
      const result = await axiosInstance.get(API_PATH.SHIFTS.GET_SHIFTS, {
        params: { start: moment(selectedMonth).format("yyyy-MM-DD") },
      });
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
      } else {
        setEvents([]);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const getAllUser = async () => {
    try {
      const result = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (result?.data?.users?.length > 0) {
        setUsers(result.data.users);
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

  useEffect(() => {
    getAllUser();
    return () => {};
  }, []);

  useEffect(() => {
    getAllShifts();
    return () => {};
  }, [selectedMonth]);

  return (
    <DashboardLayout activeMenu="Statistiken anzeigen">
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-3 bg-white rounded-2xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">
            Monatliche Schichtübersicht:
            <span className="text-red-500">
              {" "}
              {moment(selectedMonth).format("MM/YYYY")}
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
                  events.filter((event) =>
                    String(event.start).endsWith("08:00:00+02:00")
                  ).length
                }
              </p>
            </div>
            <div className="bg-blue-100 rounded-2xl p-4 shadow-md flex-3 ">
              <p className="text-lg font-medium">Gesamte Schichten</p>
              <p className="text-3xl font-bold text-blue-600">
                {events.length}
              </p>
            </div>
            <div className="bg-purple-100 rounded-2xl p-4 shadow-md flex-3">
              <p className="text-lg font-medium">Spätschichten</p>
              <p className="text-3xl font-bold text-purple-600">
                {
                  events.filter((event) =>
                    String(event.start).endsWith("13:30:00+02:00")
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
        <div className="print-area col-span-1 md:col-span-3 bg-white rounded-2xl shadow-md p-4 overflow-auto print:overflow-visible">
          <div className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold mb-4">
              Monatliche Schichtübersicht{" "}
              <span className="text-red-500">
                {" "}
                {moment(selectedMonth).format("MM/YYYY")}
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
            filteredEvents={events}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminStatistics;
