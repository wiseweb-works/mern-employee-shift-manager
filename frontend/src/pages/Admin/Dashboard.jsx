import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import DashboardLayout from "../../components/DashboardLayout";
import { LuArrowRight } from "react-icons/lu";
import { IoIosCloseCircleOutline } from "react-icons/io";
import moment from "moment";
import Calendar from "../../components/Calendar";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import createMockData from "../../helpers/createMockData";
import {
  viewWeek,
  viewDay,
  viewMonthGrid,
  viewMonthAgenda,
} from "@schedule-x/calendar";

const Dashboard = () => {
  // useUserAuth();

  const [events, setEvents] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  const { user } = useContext(UserContext);

  const getAllUsers = async () => {
    try {
      const result = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (result.data?.users?.length > 0) {
        setEvents(createMockData(result.data.users));
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllUsers();
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
              <button
                className="card-btn"
                onClick={() => window.location.reload()}
              >
                Sayfayı Yenile
              </button>
              <button className="card-btn">Shiftleri Kaydet</button>
              <button className="card-btn">
                See All <LuArrowRight className="text-base" />
              </button>
            </div>
            <div className="mt-4">
              {events?.length > 0 && (
                <Calendar
                  events={events}
                  setEvents={setEvents}
                  views={[viewMonthAgenda]}
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
