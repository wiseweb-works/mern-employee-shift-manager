import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const UserCard = ({ userInfo }) => {
  const navigate = useNavigate();
  const handleDelete = async (userId) => {
    const isConfirmed = window.confirm("Are you sure to delete this User?");

    if (isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          API_PATH.USERS.DELETE_USER_BY_ID(userId)
        );
        if (response.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        toast.error("Error deleting users:", error);
      }
    }
  };
  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={`/avatars/avatar_${Math.floor(Math.random() * 100) + 1}.png`}
            alt={`Avatar`}
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <div>
            <p className="text-sm font-medium">{userInfo?.name}</p>
            <p className="text-xs text-gray-500">{userInfo?.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 ">
          <button
            className="flex md:flex download-btn group"
            onClick={() => navigate(`${userInfo._id}`)}
          >
            <MdEdit className="text-lg" />
            <span className="hidden group-hover:block transition duration-200 ease-in-out">
              Edit User
            </span>
          </button>
          <button
            className="flex md:flex delete-btn group"
            onClick={() => handleDelete(userInfo?._id)}
          >
            <MdDelete className="text-lg" />
            <span className="hidden group-hover:block transition duration-200 ease-in-out">
              Delete User
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-end gap-3 mt-5">
        <div
          className={`flex-1 text-[10px] text-center font-medium ${
            userInfo?.team == "sozialarbeiter"
              ? "text-cyan-500"
              : userInfo?.team == "sozialbetreuer"
              ? "text-red-500"
              : "text-yellow-600"
          }  bg-gray-50 px-4 py-0.5 rounded`}
        >
          <span className="text-[12px] font-semibold capitalize">
            {userInfo?.team}
          </span>
        </div>
        <div
          className={`flex-1 text-[10px] text-center font-medium ${
            userInfo?.workType == "full-time"
              ? "text-green-500"
              : "text-orange-500"
          } bg-gray-50 px-4 py-0.5 rounded`}
        >
          <span className="text-[12px] font-semibold capitalize">
            {userInfo?.workType}
          </span>
        </div>
        <div
          className={`flex-1 text-[10px] text-center font-medium ${
            userInfo?.isActive ? `text-violet-500` : "text-pink-900"
          }  bg-gray-50 px-4 py-0.5 rounded`}
        >
          <span className="text-[12px] font-semibold capitalize">
            {userInfo?.isActive ? `Active` : "Deactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
