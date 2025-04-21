import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import DashboardLayout from "../../components/DashboardLayout";
import { IoIosCloseCircleOutline } from "react-icons/io";
import moment from "moment";
import DashboardCalendar from "../../components/Calendars/DashboardCalendar";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { viewDay, viewMonthGrid, viewMonthAgenda } from "@schedule-x/calendar";
import ToggleSwitch from "../../components/ToogleSwitch";
import { formatToLocalTime } from "../../utils/formatToLocalTime";
import EditModal from "../../components/EditModal";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [initialData, setInitialData] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { user } = useContext(UserContext);

  const handleShiftUpdate = async (updated) => {
    if (editMode) {
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

  const handleClick = (entry) => {
    setInitialData(entry);
    setModalOpen(true);
  };

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
                <span className="text-red-500">{user?.name ?? "User"}</span>
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
              <ToggleSwitch editMode={editMode} setEditMode={setEditMode} />
            </div>
            <div className="mt-4">
              {events?.length > 0 && !editMode && (
                <DashboardCalendar
                  events={events}
                  setEvents={setEvents}
                  views={[viewMonthAgenda]}
                  editMode={editMode}
                />
              )}

              {events?.length > 0 && editMode && (
                <DashboardCalendar
                  events={events}
                  setEvents={setEvents}
                  views={[viewMonthGrid, viewDay]}
                  handleShiftUpdate={handleShiftUpdate}
                  handleClick={handleClick}
                  editMode={editMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <EditModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        initialData={initialData}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
