// src/components/dashboard/DashLayout.jsx
import { useState } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Bell, User, LogOut } from "lucide-react";
import DashNavbar from "./DashNavBar";

const DashLayout = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user type from localStorage for session persistence
  const [userType] = useState(() => localStorage.getItem("userType") || "");
  const fname = localStorage.getItem("userFirstName");
  const toggleSidebar = () => {
    setIsSidebarFolded(!isSidebarFolded);
  };

  const handleLogout = () => {
    // Clear session
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userDepartment");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    navigate("/auth");
  };

  // Header titles for different pages
  const getHeaderTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/dashboard/users":
        return "User Management";
      case "/dashboard/control":
        return "Control Panel";
      case "/dashboard/windows":
        return "Windows";
      case "/dashboard/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };
  return (
    <div className="flex h-screen bg-gray-50 font-clan-ot">
      <DashNavbar
        isSidebarFolded={isSidebarFolded}
        toggleSidebar={toggleSidebar}
        // handleLogout={handleLogout}
        userType={userType} // Pass user type to DashNavbar
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex bg-nu-blue shadow-sm p-2 text-white">
          <div className="flex-1 p-4">
            {/* <h1 className="text-xl font-bold ]">{getHeaderTitle()}</h1> */}
            <h1 className="text-xl font-bold ]">{getHeaderTitle()}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:text-nu-gold relative cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <Link
              to={"/dashboard/settings"}
              className={`flex items-center space-x-2 hover:text-nu-blue hover:bg-nu-gold rounded-xl p-3 ${
                getHeaderTitle() == "Settings" ? `text-nu-blue bg-nu-gold` : ``
              }`}
            >
              <div className="bg-gray-100 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center">
                <User size={18} className="text-nu-blue" />
              </div>
              <span className="font-medium ">{fname || "User"}</span>
            </Link>

            <button className="pr-2 hover:text-red-500" onClick={() => setShowLogoutModal(true)}>
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xs relative flex flex-col items-center">
            <h2 className="text-xl font-bold text-[#32418C] mb-4 text-center">Logout Confirmation</h2>
            <p className="mb-6 text-gray-700 text-center">Are you sure you want to logout?</p>
            <div className="flex gap-4 w-full justify-center">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    // <div className="hidden md:flex items-center justify-between bg-white shadow-sm px-6 py-4">
    //   <div className="flex-1">
    //     <h1 className="text-xl font-bold text-[#32418C]">Dashboard</h1>
    //   </div>

    // <div className="flex items-center space-x-4">
    //   <button className="p-2 text-gray-600 hover:text-[#32418C] relative">
    //     <Bell size={20} />
    //     <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
    //   </button>

    //   <div className="flex items-center space-x-2">
    //     <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center">
    //       <User size={18} className="text-gray-500" />
    //     </div>
    //     <span className="text-gray-700 font-medium">Admin</span>
    //   </div>

    //   <button className="p-2 text-gray-600 hover:text-red-500">
    //     <LogOut size={20} />
    //   </button>
    // </div>
    // </div>
  );
};

export default DashLayout;
