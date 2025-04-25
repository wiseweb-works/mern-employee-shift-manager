import { useContext, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router";
import Input from "../Inputs/Input";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import { UserContext } from "../context/UserContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return;
    }

    if (!password) {
      toast.error("Bitte geben Sie das Passwort ein");
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        toast.success("Anmeldung war erfolgreich");
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "employee") {
          navigate("/user/dashboard");
        } else {
          navigate("/login");
        }
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
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Willkommen zurück</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Bitte geben Sie Ihre Daten ein, um sich einzuloggen
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="E-Mail-Adresse"
            placeholder="max@mustermann.de"
            type="text"
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Passwort"
            placeholder="Mindestens 8 Zeichen"
            type="password"
          />

          <button type="submit" className="btn-primary">
            EINLOGGEN
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
