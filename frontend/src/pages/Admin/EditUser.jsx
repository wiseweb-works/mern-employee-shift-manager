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
      toast.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name) {
      toast.error("Please enter full name");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!team) {
      toast.error("Please select a valid Team");
      return;
    }
    if (!workType) {
      toast.error("Please select a valid Work Type");
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
        toast.error("Something went wrong. Please try again.");
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
            Edit a Team Member
          </h3>
          <Link to="/admin/users" className="card-btn">
            <LuArrowLeft className="text-base text-red-500" />
            Turn Back!
          </Link>
        </div>
        <p className="text-sx text-slate-700 mt-[5px] mb-6">
          Please correct her/him details
        </p>

        <form onSubmit={handleUpdate}>
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
                  <option value="sozialbetreuerhelfer">
                    Sozialbetreuerhelfer
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[13px] text-slate-800">Work Type</label>
              <div className="input-box">
                <select
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full bg-transparent outline-none"
                >
                  <option value="">Please Select</option>
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[13px] text-slate-800">Active User</label>
            <div className="input-box">
              <select
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
                className="w-full bg-transparent outline-none"
              >
                <option value="">Please Select</option>
                <option value={true}>Active</option>
                <option value={false}>Deactive</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            UPDATE USER
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditUser;
