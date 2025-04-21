import { BrowserRouter, Route, Routes } from "react-router";
import UserProvider from "../context/UserContext";
import Login from "../pages/Login";
import Root from "../pages/Root";
import Dashboard from "../pages/Admin/Dashboard";
import CreateUsers from "../pages/Admin/CreateUser";
import ManageUsers from "../pages/Admin/ManageUsers";
import EditUser from "../pages/Admin/EditUser";
import CreateShifts from "../pages/Admin/CreateShifts";
import UserDashboard from "../pages/User/UserDashboard";
import ViewStatistics from "../pages/User/ViewStatistics";
import ChangePassword from "../pages/User/ChangePassword";
import AdminStatistics from "../pages/Admin/AdminStatistics";
import PrivateRoute from "./PrivateRoute";
import { Toaster } from "react-hot-toast";

const AppRouter = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Route */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/create-shifts" element={<CreateShifts />} />
            <Route path="/admin/create-user" element={<CreateUsers />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/users/:id" element={<EditUser />} />
            <Route path="/admin/statistics" element={<AdminStatistics />} />
          </Route>

          {/* User Route */}
          <Route element={<PrivateRoute allowedRoles={["employee"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/statistics" element={<ViewStatistics />} />
            <Route path="/user/change-password" element={<ChangePassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </UserProvider>
  );
};

export default AppRouter;
