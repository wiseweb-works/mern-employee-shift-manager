import { useContext, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { UserContext } from "../../context/UserContext";
import Input from "../../Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { useNavigate } from "react-router";

const ChangePassword = () => {
  const { user, clearUser } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!password) {
      toast.error("Sie müssen Ihr altes Passwort eingeben");
      return;
    }

    if (!newPassword) {
      toast.error("Sie müssen Ihr neues Passwort eingeben");
      return;
    }

    try {
      const response = await axiosInstance.put(
        API_PATH.USERS.UPDATE_USER_PASSWORD,
        {
          password,
          newPassword,
        }
      );
      if (response.status === 200) {
        handleLogout();
      }
    } catch (error) {
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <DashboardLayout activeMenu="Passwort ändern">
      <div className="lg:w-[80%] h-auto md:h-full m-auto mt-10 md:mt-0 flex flex-col justify-center">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold text-black">
            Ändern Sie Ihr Passwort
          </h3>
        </div>
        <p className="text-sx text-slate-700 mt-[5px] mb-6">
          Bitte geben Sie Ihr altes und neues Passwort ein.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={user?.name}
              readonly
              label="Vollständiger Name"
              placeholder="Max Mustermann"
              type="text"
            />
            <Input
              value={user?.email}
              readonly
              label="E-Mail-Adresse"
              placeholder="max@example.com"
              type="text"
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              label="Altes Passwort"
              placeholder="Bitte geben Sie Ihr altes Passwort ein"
            />
            <Input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              label="Neues Passwort"
              placeholder="Bitte geben Sie Ihr neues Passwort ein"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            PASSWORT AKTUALISIEREN
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
