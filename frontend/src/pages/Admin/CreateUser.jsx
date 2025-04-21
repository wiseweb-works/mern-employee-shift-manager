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
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!name) {
      setError("Please enter full name");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

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
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <DashboardLayout activeMenu="Create User">
      <div className="lg:w-[80%] h-auto md:h-full m-auto mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">
          Create a Team Members
        </h3>
        <p className="text-sx text-slate-700 mt-[5px] mb-6">
          Please enter his/her details
        </p>

        <form onSubmit={handleSignUp}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />

            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Min 8 Characters"
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
                  <option value="">Please Select</option>
                  <option value="sozialbetreuer">Sozialbetreuer</option>
                  <option value="sozialarbeiter">Sozialarbeiter</option>
                </select>
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateUsers;
