import { useContext, useState } from "react";
import SideMenu from "./SideMenu";
import Navbar from "./Navbar";
import { UserContext } from "../context/UserContext";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);
  const [show, setShow] = useState(true);

  return (
    <div className="">
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className="flex">
          <div className={`max-[1080px]:hidden ${show ? "" : "hidden"}`}>
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className="relative max-[1080px]:hidden">
            <button
              onClick={() => setShow(!show)}
              aria-label={show ? "Seitenleiste verbergen" : "Seitenleiste anzeigen"}
              className={`fixed top-32 ${
                show ? "left-64" : "left-0"
              }  z-50 bg-blue-600 text-white px-2 py-1 rounded-r-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition`}
            >
              {show ? "←" : "→"}
            </button>
          </div>
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
