import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import DashboardLayout from "../../components/DashboardLayout";
import { LuArrowRight } from "react-icons/lu";
import { IoIosCloseCircleOutline } from "react-icons/io";
import moment from "moment";
import DashboardCalendar from "../../components/DashboardCalendar";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import {
  viewWeek,
  viewDay,
  viewMonthGrid,
  viewMonthAgenda,
} from "@schedule-x/calendar";
import ToggleSwitch from "../../components/ToogleSwitch";
import { formatToLocalTime } from "../../utils/formatToLocalTime";

const Dashboard = () => {
  // useUserAuth();

  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [enabled, setEnabled] = useState(false);

  const { user } = useContext(UserContext);

  const handleShiftUpdate = async (updated) => {
    if (enabled) {
      try {
        const response = await axiosInstance.put(
          API_PATH.SHIFTS.UPDATE_SHIFTS(updated._id),
          { start: updated.start, end: updated.end }
        );
        if (response?.status === 200) {
          console.log("Shift Updated Succesfully");
          getAllShifts();
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getAllShifts = async () => {
    try {
      const result = await axiosInstance.get(API_PATH.SHIFTS.GET_SHIFTS);
      if (result?.data?.shifts?.length > 0) {
        console.log(result.data.shifts);
        const formattedShiftDataArray = result.data.shifts.map((shift) => ({
          ...shift,
          id: shift._id,
          start: formatToLocalTime(shift.start),
          end: formatToLocalTime(shift.end),
          title: shift.employee.name,
          calendarId: shift.employee.team,
          uid: shift.employee._id,
        }));
        console.log(formattedShiftDataArray);
        setEvents(formattedShiftDataArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllShifts();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {isOpen && (
        <div className="card my-5">
          <div className="flex items-center justify-between">
            <div className="col-span-3">
              <h2 className="text-xl md:text-2xl">
                Good Morning! {user?.name ?? "User"}
              </h2>
              <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                {moment().format("DD.MM.YYYY")}
              </p>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-full shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-300 ease-out"
            >
              <IoIosCloseCircleOutline className="text-2xl" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Shifts</h5>
              <ToggleSwitch enabled={enabled} setEnabled={setEnabled} />
            </div>
            <div className="mt-4">
              {events?.length > 0 && !enabled && (
                <DashboardCalendar
                  events={events}
                  setEvents={setEvents}
                  views={[viewMonthAgenda]}
                />
              )}

              {events?.length > 0 && enabled && (
                <DashboardCalendar
                  events={events}
                  setEvents={setEvents}
                  views={[viewMonthGrid, viewDay]}
                  handleShiftUpdate={handleShiftUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
