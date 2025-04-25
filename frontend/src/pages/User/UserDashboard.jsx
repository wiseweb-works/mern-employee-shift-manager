import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { UserContext } from "../../context/UserContext";
import moment from "moment-timezone";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import UserCalendar from "../../components/Calendars/UserCalendar";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(true);
  const [events, setEvents] = useState([]);

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
                Guten{" "}
                {moment().hour() < 12
                  ? "Morgen"
                  : moment().hour() < 19
                  ? "Tag"
                  : "Abend"}{" "}
                <span className="text-red-500">{user?.name ?? "Benutzer"}</span>
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
              <h5 className="text-lg">Letzte Schichten</h5>
            </div>
            <div className="mt-4">
              {events?.length > 0 && <UserCalendar events={events} />}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
