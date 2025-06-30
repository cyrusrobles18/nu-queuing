import { Link, useLocation } from "react-router-dom";
import {
  PanelLeftClose,
  PanelLeftOpen,
  LayoutDashboard,
  Users,
  Blocks,
  FileClock
} from "lucide-react";

import nuhorilogo from "../assets/images/nulogohorizontal.png";

const DashNavBar = ({
  isSidebarFolded,
  toggleSidebar,
  // handleLogout,
  userType,
}) => {
  const location = useLocation();
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard />,
      roles: ["System Admin", "Head", "Staff"],
    },
    {
      name: "Users",
      path: "/dashboard/users",
      icon: <Users />,
      roles: ["System Admin", "Head"],
    },

    {
      name: "Control Panel",
      path: "/dashboard/control",
      icon: <Blocks />,
      roles: ["Head", "Staff"],
    },
    {
      name: "Counters",
      path: "/dashboard/windows",
      icon: <FileClock />,
      roles: ["Head"],
    },

    // {
    //   name: "Settings",
    //   path: "/dashboard/settings",
    //   icon: <Settings />,
    //   roles: ["System Admin", "Head", "Staff"],
    // },
  ];
  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userType)
  );
  return (
    <aside
      className={`bg-nu-blue shadow-lg transform transition-all duration-300 ease-in-out text-white ${
        isSidebarFolded ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full text-white">
        {/* Logo */}
        <div
          // className={`flex items-center p-4 border-b border-primary ${
          //   isSidebarFolded ? "justify-center" : "justify-between"
          // }`}
          className={`flex items-center p-4 ${
            isSidebarFolded ? "justify-center" : "justify-between"
          }`}
        >
          {!isSidebarFolded && (
            <div className="flex text-xl font-bold text-primary items-center">
              {/* <img className="w-44" src={logoBlue} alt="metriccon-logo" /> */}
              <img
                className="w-40"
                src={nuhorilogo}
                alt="nu-logo"
              />
              {/* <span className="ml-2">Metriccon</span> */}
            </div>
            // <img className="w-24" src={logoHori} alt="metriccon-logo" />
          )}
          <div
            onClick={toggleSidebar}
            className="py-2 rounded-lg cursor-pointer"
          >
            {isSidebarFolded ? (
              <div className="flex flex-col items-center">
                <img
                  className="w-10 items-center justify-center object-center"
                  src="/src/assets/images/nu-shield.png"
                  alt="nu-logo"
                />
                <PanelLeftOpen className=" mt-7" />
              </div>
            ) : (
              <PanelLeftClose className=" " />
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 ">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? "text-nu-blue-dark bg-nu-gold"
                      : "hover:bg-nu-gold hover:text-nu-blue-dark"
                  } ${isSidebarFolded ? "justify-center" : "justify-start"}`}
                >
                  {item.icon}
                  {!isSidebarFolded && (
                    <span className="ml-4 font-medium">{item.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* <div
          onClick={handleLogout}
          className={`p-4 text-primary flex items-center w-full hover:bg-errLight hover:text-white transition-colors ${
            isSidebarFolded ? "justify-center" : "justify-start"
          }`}
        >
          <LogOut className=" w-6 h-6" />
          {!isSidebarFolded && <span className="ml-4 ">Logout</span>}
        </div>

        <div className="p-4 border-t text-primary border-primary">
          <div
            className={`flex items-center ${
              isSidebarFolded ? "justify-center" : "justify-start"
            }`}
          >
            <CircleUserRound />
            {!isSidebarFolded && (
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {userType === "System Admin" ? "System Admin" : "Staff User"}
                </p>
                <p className="text-xs text-gray-500">
                  {userType === "System Admin"
                    ? "admin@example.com"
                    : "staff@example.com"}
                </p>
              </div>
            )}
          </div>
        </div> */}
      </div>
    </aside>
  );
};

export default DashNavBar;
