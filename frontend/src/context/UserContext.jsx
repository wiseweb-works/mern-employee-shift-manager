import { useState, createContext, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import toast from "react-hot-toast";

export const UserContext = createContext({
  user: null,
  loading: true,
  updateUser: () => {},
  clearUser: () => {},
});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATH.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch {
        toast.error("Benutzer nicht authentifiziert");
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
