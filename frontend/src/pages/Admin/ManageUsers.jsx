import DashboardLayout from "../../components/DashboardLayout";
import { API_PATH } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import UserCard from "../../components/UserCards";
import { RiResetLeftFill } from "react-icons/ri";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [teamFilter, setTeamFilter] = useState("all");
  const [workFilter, setWorkFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (response.data?.users?.length > 0) {
        setAllUsers(response.data.users);
      }
    } catch (error) {
      toast.error("Fehler beim Abrufen der Benutzer:", error);
    }
  };

  const handleFilter = () => {
    let filtered = allUsers;
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

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Teammitglieder">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Teammitglieder</h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <span className="select-boxx">{`Anzahl: ${
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
              <option value="sozialbetreuerhelfer">Sozialbetreuerhelfer</option>
            </select>
            <select
              className="select-boxx"
              onChange={(e) => setWorkFilter(e.target.value)}
              value={workFilter}
            >
              <option value="all">Arbeitsart</option>
              <option value="full-time">Vollzeit</option>
              <option value="part-time">Teilzeit</option>
            </select>
            <select
              className="select-boxx"
              onChange={(e) => setActiveFilter(e.target.value)}
              value={activeFilter}
            >
              <option value="all">Aktiv/Inaktiv</option>
              <option value="active">Aktiv</option>
              <option value="deactive">Inaktiv</option>
            </select>
            {(teamFilter !== "all" || workFilter !== "all") && (
              <button
                className="flex md:flex download-btn shadow-sm"
                onClick={handleReset}
              >
                <RiResetLeftFill className="text-lg" />
                Zurücksetzen
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {handleFilter()?.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
