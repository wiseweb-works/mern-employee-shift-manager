import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuLock,
} from "react-icons/lu";
import { MdQueryStats } from "react-icons/md";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Create Shifts",
    icon: LuClipboardCheck,
    path: "/admin/create-shifts",
  },
  {
    id: "03",
    label: "View Statistics",
    icon: MdQueryStats,
    path: "/admin/statistics",
  },
  {
    id: "04",
    label: "Create User",
    icon: LuSquarePlus,
    path: "/admin/create-user",
  },
  {
    id: "05",
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "06",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "View Statistics",
    icon: LuClipboardCheck,
    path: "/user/statistics",
  },
  {
    id: "03",
    label: "Change Password",
    icon: LuLock,
    path: "/user/change-password",
  },
  {
    id: "05",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];
