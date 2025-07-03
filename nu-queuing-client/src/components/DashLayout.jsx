// src/components/dashboard/DashLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Bell, User, LogOut, Settings } from "lucide-react";
import DashNavbar from "./DashNavBar";
import {
  fetchWindowsByDepartment,
  updateWindow,
} from "../services/WindowService";

const transactionOptions = {
  treasury: [
    "Payment for Balance",
    "Payment for Enrollment",
    "Payment for Promi",
    "Others",
    "Validation Concerns",
  ],
  registrar: [
    "Request Assessment",
    "Request COR",
    "Request TOR",
    "Request CTC",
    "Request for Dismissal",
    "Others",
    "Validation Concerns",
  ],
  admissions: [
    "Enrollment",
    "Submission of Documents",
    "Others",
    "Validation Concerns",
  ],
};

const DashLayout = () => {
  const [isSidebarFolded, setIsSidebarFolded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableWindows, setAvailableWindows] = useState([]);
  const [selectedWindowId, setSelectedWindowId] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user type from localStorage for session persistence
  const [userType] = useState(() => localStorage.getItem("userType") || "");
  const fname = localStorage.getItem("userFirstName");
  const userDepartment = localStorage.getItem("userDepartment")?.toLowerCase();
  const userId = localStorage.getItem("userId");

  const toggleSidebar = () => {
    setIsSidebarFolded(!isSidebarFolded);
  };

  const handleLogout = async () => {
    // If staff, unassign their window before clearing session
    if (userType === "Staff" && userDepartment && userId) {
      try {
        const { data } = await fetchWindowsByDepartment(userDepartment);
        const assigned = (data.windows || []).find(
          (w) => w.isAssigned && w.assignedTo === userId
        );
        if (assigned) {
          await updateWindow(assigned._id, {
            isAssigned: false,
            assignedTo: "",
          });
        }
      } catch (err) {
        // Optionally handle error
      }
    }
    // Clear session
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userDepartment");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userId");
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

  // Fetch available windows for staff
  useEffect(() => {
    const checkStaffAssignment = async () => {
      if (userType === "Staff" && userDepartment) {
        // Fetch all windows for department
        const { data } = await fetchWindowsByDepartment(userDepartment);
        // Check if already assigned
        const assigned = (data.windows || []).find(
          (w) => w.isAssigned && w.assignedTo === userId
        );
        if (!assigned) {
          // Not assigned, show modal
          const unassigned = (data.windows || []).filter((w) => !w.isAssigned);
          setAvailableWindows(unassigned);
          setShowAssignModal(true);
        } else {
          setShowAssignModal(false);
        }
      }
    };
    checkStaffAssignment();
    // eslint-disable-next-line
  }, [userType, userDepartment]);

  // Assign window to staff
  const handleAssignWindow = async () => {
    if (!selectedWindowId || !selectedTransaction) return;
    setAssignLoading(true);
    try {
      await updateWindow(selectedWindowId, {
        isAssigned: true,
        assignedTo: userId,
        transaction: selectedTransaction,
      });
      // Find the selected window object to get its windowNumber
      const selectedWindowObj = availableWindows.find(w => w._id === selectedWindowId);
      if (selectedWindowObj) {
        localStorage.setItem("windowNumber", selectedWindowObj.windowNumber || "");
      } else {
        localStorage.setItem("windowNumber", "");
      }
      setShowAssignModal(false);
    } catch (err) {
      // Optionally handle error
    } finally {
      setAssignLoading(false);
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
        {/* Staff Assignment Modal */}
        {showAssignModal && userType === "Staff" && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
            style={{ pointerEvents: "auto" }}
          >
            <div
              className="absolute inset-0 bg-black opacity-0"
              style={{ pointerEvents: "none" }}
            />
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative flex flex-col items-center z-10">
              <h2 className="text-xl font-bold text-[#32418C] mb-4 text-center">
                Select Your Window
              </h2>
              <div className="w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Windows
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3"
                  value={selectedWindowId}
                  onChange={(e) => setSelectedWindowId(e.target.value)}
                >
                  <option value="">Select window</option>
                  {availableWindows.map((w) => (
                    <option key={w._id} value={w._id}>
                      {w.windowNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={selectedTransaction}
                  onChange={(e) => setSelectedTransaction(e.target.value)}
                  disabled={!selectedWindowId}
                >
                  <option value="">Select transaction</option>
                  {(transactionOptions[userDepartment] || []).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 w-full justify-center">
                <button
                  className="px-4 py-2 rounded-lg bg-nu-blue text-white hover:bg-nu-blue-dark"
                  onClick={handleAssignWindow}
                  disabled={
                    assignLoading || !selectedWindowId || !selectedTransaction
                  }
                >
                  {assignLoading ? "Assigning..." : "Assign Window"}
                </button>
              </div>
            </div>
          </div>
        )}

        <header className="flex bg-nu-blue shadow-sm p-2 text-white">
          <div className="flex-1 p-4">
            {/* <h1 className="text-xl font-bold ]">{getHeaderTitle()}</h1> */}
            <h1 className="text-xl font-bold ]">{getHeaderTitle()}</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* <button className="p-2 hover:text-nu-gold relative cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button> */}
            {userType === "Staff" && (
              <button
                className="pr-2 hover:text-red-500"
                onClick={
                  userType === "Staff"
                    ? () => setShowAssignModal(true)
                    : undefined
                }
              >
                <Settings size={20} />
              </button>
            )}

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

            <button
              className="pr-2 hover:text-red-500"
              onClick={() => setShowLogoutModal(true)}
            >
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
            <h2 className="text-xl font-bold text-[#32418C] mb-4 text-center">
              Logout Confirmation
            </h2>
            <p className="mb-6 text-gray-700 text-center">
              Are you sure you want to logout?
            </p>
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
