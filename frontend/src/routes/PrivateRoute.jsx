import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { UserContext } from "../context/UserContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useContext(UserContext);

  return <Outlet />;

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
