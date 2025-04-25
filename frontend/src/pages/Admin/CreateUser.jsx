import { useState } from "react";
import { useNavigate } from "react-router";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import Input from "../../Inputs/Input";
import DashboardLayout from "../../components/DashboardLayout";

const CreateUsers = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return;
    }

    if (!name) {
      toast.error("Bitte geben Sie den vollständigen Namen ein");
      return;
    }

    if (!password) {
      toast.error("Bitte geben Sie das Passwort ein");
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
        name: name,
        email,
        password,
        team,
      });

      const { token } = response.data;

      if (token) {
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
    }
  };

  return (
    <DashboardLayout activeMenu="Benutzer erstellen">
      <div className="lg:w-[80%] h-auto md:h-full m-auto mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">
          Teammitglied erstellen
        </h3>
        <p className="text-sx text-slate-700 mt-[5px] mb-6">
          Bitte geben Sie die Details ein
        </p>

        <form onSubmit={handleSignUp}>
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

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Passwort"
              placeholder="Mind. 8 Zeichen"
              type="password"
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
          </div>

          <button type="submit" className="btn-primary">
            REGISTRIEREN
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateUsers;
