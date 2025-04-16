import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
} from "react-icons/lu";

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
    label: "Create User",
    icon: LuSquarePlus,
    path: "/admin/create-user",
  },
  {
    id: "04",
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "05",
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
    label: "Manage Shifts",
    icon: LuClipboardCheck,
    path: "/user/shifts",
  },
  {
    id: "05",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];
