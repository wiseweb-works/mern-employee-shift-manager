import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const UserCard = ({ userInfo }) => {
  const navigate = useNavigate();
  const handleDelete = async (userId) => {
    const isConfirmed = window.confirm(
      "Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?"
    );

    if (isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          API_PATH.USERS.DELETE_USER_BY_ID(userId)
        );
        if (response.status === 200) {
          window.location.reload();
        }
      } catch (error) {
        toast.error("Fehler beim Löschen des Benutzers:", error);
      }
    }
  };
  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
            src={`/avatars/avatar_${Math.floor(Math.random() * 100) + 1}.png`}
            onError={(e) => {
              e.currentTarget.src = `https://avatar.iran.liara.run/public/${
                Math.floor(Math.random() * 100) + 1
              }`;
            }}
            alt="avatar"
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
              Benutzer bearbeiten
            </span>
          </button>
          <button
            className="flex md:flex delete-btn group"
            onClick={() => handleDelete(userInfo?._id)}
          >
            <MdDelete className="text-lg" />
            <span className="hidden group-hover:block transition duration-200 ease-in-out">
              Benutzer löschen
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
            {userInfo?.workType === "full-time" ? "Vollzeit" : "Teilzeit"}
          </span>
        </div>
        <div
          className={`flex-1 text-[10px] text-center font-medium ${
            userInfo?.isActive ? `text-violet-500` : "text-pink-900"
          }  bg-gray-50 px-4 py-0.5 rounded`}
        >
          <span className="text-[12px] font-semibold capitalize">
            {userInfo?.isActive ? `Aktiv` : "Inaktiv"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
