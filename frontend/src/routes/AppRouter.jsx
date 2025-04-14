import { BrowserRouter, Route, Routes } from "react-router";
import UserProvider from "../context/UserContext";
import Login from "../pages/Login";
import Root from "../pages/Root";
import Dashboard from "../pages/Admin/Dashboard";
import CreateUsers from "../pages/Admin/CreateUser";
import ManageUsers from "../pages/Admin/ManageUsers";
import EditUser from "../pages/Admin/EditUser";

const AppRouter = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/shifts" element={<div>SHIFTS</div>} />
          <Route path="/admin/create-user" element={<CreateUsers />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/users/:id" element={<EditUser />} />

          {/* <Route path="/signup" element={<SignUp />} /> */}
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
};

export default AppRouter;
