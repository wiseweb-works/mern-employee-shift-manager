import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import StatisticBar from "../../components/StatisticBar";
import createMockData from "../../helpers/createMockData";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { LuArrowDown, LuArrowUp } from "react-icons/lu";
import Calendar from "../../components/Calendar";
import {
  viewWeek,
  viewDay,
  viewMonthGrid,
  viewMonthAgenda,
} from "@schedule-x/calendar";

const CreateShifts = () => {
  const [isOpen, setIsOpen] = useState(
    localStorage.getItem("toogleStats") === "true" ? true : false
  );
  const [allUsers, setAllUsers] = useState([]);
  const [events, setEvents] = useState([]);

  const { user } = useContext(UserContext);

  const handleToogle = () => {
    setIsOpen(!isOpen);
    localStorage.setItem("toogleStats", JSON.stringify(!isOpen));
  };

  const getAllUsers = async () => {
    try {
      const result = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (result.data?.users?.length > 0) {
        setAllUsers(result.data.users);
        setEvents(createMockData(result.data.users));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Create Shifts">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6">
        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Shifts</h5>
              <button
                className="card-btn"
                onClick={() => window.location.reload()}
              >
                Sayfayı Yenile
              </button>
              <button className="card-btn">Shiftleri Kaydet</button>
              <button className="card-btn" onClick={handleToogle}>
                {isOpen ? "Hide" : "Show"}
                {isOpen ? (
                  <LuArrowDown className="text-base" />
                ) : (
                  <LuArrowUp className="text-base" />
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 mt-5">
              {isOpen &&
                allUsers.map((user, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-2 md:w-2 h-3 md:h-5 ${
                        user.team == "sozialarbeiter"
                          ? "bg-primary"
                          : "bg-red-500"
                      } rounded-full`}
                    />
                    <div className="text-xs md:text-[14px] text-gray-500 text-center">
                      <p className="text-sm md:text-[15px] text-black font-semibold capitalize">
                        {user.name}
                      </p>
                      <p className="ml-2 capitalize">{user.team}</p>
                    </div>

                    {
                      <StatisticBar
                        morningCount={
                          events
                            .filter((event) => event.uid === user._id)
                            .filter((shift) =>
                              String(shift.start).endsWith("08:00")
                            ).length
                        }
                        nightCount={
                          events
                            .filter((event) => event.uid === user._id)
                            .filter((shift) =>
                              String(shift.end).endsWith("20:00")
                            ).length
                        }
                        totalCount={
                          events.filter((event) => event.uid === user._id)
                            .length
                        }
                      />
                    }
                  </div>
                ))}
            </div>
            <div className="mt-4">
              {events?.length > 0 && (
                <Calendar
                  events={events}
                  setEvents={setEvents}
                  views={[viewMonthGrid, viewDay]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateShifts;
