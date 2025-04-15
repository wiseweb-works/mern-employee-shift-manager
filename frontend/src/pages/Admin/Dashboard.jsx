import { useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../../context/UserContext";
import DashboardLayout from "../../components/DashboardLayout";
import { LuArrowRight } from "react-icons/lu";
import moment from "moment";
import Calendar from "../../components/Calendar";

const Dashboard = () => {
  // useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl">
              Good Morning! {user?.name ?? "User"}
            </h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("DD.MM.YYYY")}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <p>INFO CARD</p>
          <p>INFO CARD</p>
          <p>INFO CARD</p>
        </div>
      </div>

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
              <Calendar />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
