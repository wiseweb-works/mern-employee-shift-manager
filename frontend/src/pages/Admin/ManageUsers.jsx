import { LuFileSpreadsheet } from "react-icons/lu";
import DashboardLayout from "../../components/DashboardLayout";
import { API_PATH } from "../../utils/apiPath";
import axiosInstance from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import UserCard from "../../components/UserCards";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (response.data?.users?.length > 0) {
        setAllUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetchin users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>
          {/* <button className="flex md:flex download-btn"> */}
          <button className="hidden download-btn">
            <LuFileSpreadsheet className="text-lg" />
            Empty Button
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers?.map((user) => (
            <UserCard key={user._id} userInfo={user} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
