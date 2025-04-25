import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import DashboardLayout from "../../components/DashboardLayout";
import Input from "../../Inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { validateEmail } from "../../utils/helper";
import { LuArrowLeft } from "react-icons/lu";

const EditUser = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [workType, setWorkType] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getUserInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATH.USERS.GET_USER_BY_ID(id)
      );
      if (response.data) {
        const user = response.data;
        setName(user.name);
        setEmail(user.email);
        setTeam(user.team);
        setWorkType(user.workType);
        setIsActive(user.isActive);
      }
    } catch (error) {
      toast.error("Fehler beim Abrufen des Benutzers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name) {
      toast.error("Bitte geben Sie den vollständigen Namen ein");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return;
    }

    if (!team) {
      toast.error("Bitte wählen Sie ein gültiges Team aus");
      return;
    }
    if (!workType) {
      toast.error("Bitte wählen Sie eine gültige Arbeitsart aus");
      return;
    }

    try {
      const response = await axiosInstance.put(
        API_PATH.USERS.UPDATE_USER_BY_ID(id),
        {
          name: name,
          email,
          team,
          workType,
          isActive,
        }
      );

      if (response.status == 200) {
        navigate("/admin/users");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          "Etwas ist schief gelaufen. Bitte versuchen Sie es erneut."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    return () => {};
  }, []);

  return (
    <DashboardLayout>
      <div className="lg:w-[80%] h-auto md:h-full m-auto mt-10 md:mt-0 flex flex-col justify-center">
        <div className="flex justify-between">
          <h3 className="text-xl font-semibold text-black">
            Teammitglied bearbeiten
          </h3>
          <Link to="/admin/users" className="card-btn">
            <LuArrowLeft className="text-base text-red-500" />
            Zurück!
          </Link>
        </div>
        <p className="text-sx text-slate-700 mt-[5px] mb-6">
          Bitte korrigieren Sie die Angaben dieser Person
        </p>

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Vollständiger Name"
              placeholder="Max Mustermann"
              type="text"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="E-Mail-Adresse"
              placeholder="max@beispiel.de"
              type="text"
            />

            <div>
              <label className="text-[13px] text-slate-800">Team</label>
              <div className="input-box">
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Bitte auswählen</option>
                  <option value="sozialbetreuer">Sozialbetreuer</option>
                  <option value="sozialarbeiter">Sozialarbeiter</option>
                  <option value="sozialbetreuerhelfer">
                    Sozialbetreuerhelfer
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[13px] text-slate-800">Arbeitsart</label>
              <div className="input-box">
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Bitte auswählen</option>
                  <option value="full-time">Vollzeit</option>
                  <option value="part-time">Teilzeit</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[13px] text-slate-800">
              Aktiver Benutzer
            </label>
            <div className="input-box">
              <select
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                <option value="">Bitte auswählen</option>
                <option value={true}>Aktiv</option>
                <option value={false}>Inaktiv</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            BENUTZER AKTUALISIEREN
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditUser;
