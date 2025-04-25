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
    label: "Schichten erstellen",
    icon: LuClipboardCheck,
    path: "/admin/create-shifts",
  },
  {
    id: "03",
    label: "Statistiken anzeigen",
    icon: MdQueryStats,
    path: "/admin/statistics",
  },
  {
    id: "04",
    label: "Benutzer erstellen",
    icon: LuSquarePlus,
    path: "/admin/create-user",
  },
  {
    id: "05",
    label: "Teammitglieder",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "06",
    label: "Abmelden",
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
    label: "Statistiken anzeigen",
    icon: LuClipboardCheck,
    path: "/user/statistics",
  },
  {
    id: "03",
    label: "Passwort ändern",
    icon: LuLock,
    path: "/user/change-password",
  },
  {
    id: "05",
    label: "Abmelden",
    icon: LuLogOut,
    path: "logout",
  },
];
