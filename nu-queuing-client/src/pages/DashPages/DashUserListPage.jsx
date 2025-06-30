import { useEffect, useState } from "react";
import { fetchUsers, createUser, updateUser } from "../../services/UserService";
import { DataGrid } from "@mui/x-data-grid";
import { UserPlus2, UserRoundPen, ToggleLeft, ToggleRight } from "lucide-react";

const DashUserListPage = () => {
  const [isEditing, setIsEditing] = useState(false); // Track if editing
  const [editUserId, setEditUserId] = useState(null); // Track the user being edited
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    type: "",
    department: "",
    email: "",
    contactNumber: "",
    password: "",
    isActive: true,
  });
  const [open, setOpen] = useState(false); // Modal open state
  const [modalLoading, setModalLoading] = useState(false); // Modal submit button loading state
  const userDepartment = localStorage.getItem("userDepartment");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await fetchUsers();
      // Get logged-in user info from localStorage
      const userType = localStorage.getItem("userType");
      let filteredUsers = data.users;
      if (userType === "Head") {
        // Only show staff in the same department
        filteredUsers = data.users.filter(
          (user) => user.type === "Staff" && user.department === userDepartment
        );
      }
      // System Admin sees all users (no filter)
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpen = () => {
    setIsEditing(false); // Reset to "Add" mode
    const userType = localStorage.getItem("userType");
    const userDepartment = localStorage.getItem("userDepartment");
    setNewUser({
      firstName: "",
      lastName: "",
      type: userType === "Head" ? "Staff" : "",
      department: userType === "Head" ? userDepartment : "",
      email: "",
      contactNumber: "",
      password: "",
      isActive: true,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditUserId(null);
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user._id === id);
    if (userToEdit) {
      setNewUser({ ...userToEdit, password: "" }); // Set password to an empty string
      setEditUserId(id); // Track the user being edited
      setIsEditing(true); // Switch to "Edit" mode
      setOpen(true); // Open the modal
    }
  };

  const handleSaveUser = async () => {
    setModalLoading(true);
    try {
      if (isEditing) {
        // Update user
        const updatedUser = { ...newUser };
        if (!updatedUser.password) {
          delete updatedUser.password; // Exclude password if it's empty
        }
        await updateUser(editUserId, updatedUser);
      } else {
        // Add new user
        await createUser(newUser);
      }
      await loadUsers(); // Reload users
      handleClose(); // Close modal
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await updateUser(id, { isActive: !isActive });
      loadUsers(); // Reload users after toggling
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,

      valueGetter: (value, params) =>
        `${params.firstName || ""} ${params.lastName || ""}`,
    },
    // { field: "age", headerName: "Age", flex: 1, sortable: true },
    // { field: "gender", headerName: "Gender", flex: 1, sortable: true },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "type", headerName: "Type", flex: 1, sortable: true },
    { field: "department", headerName: "Department", flex: 1, sortable: true },
    { field: "contactNumber", headerName: "Contact", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="flex-col items-center space-x-2">
          <button onClick={() => handleEdit(params.row._id)}>
            <UserRoundPen className="text-nu-gold hover:text-nu-blue" />
          </button>
          <button
            onClick={() =>
              handleToggleActive(params.row._id, params.row.isActive)
            }
          >
            {params.row.isActive ? (
              <ToggleRight className="text-green-500 hover:text-green-700" />
            ) : (
              <ToggleLeft className="text-gray-400 hover:text-nu-blue" />
            )}
          </button>
        </div>
      ),
    },
  ];

  // Modal form fields
  const userTypes = ["System Admin", "Head", "Staff", "Student"];
  const departments = ["Treasury", "Admissions", "Registrar"];

  return (
    // h-dvh
    <div className="bg-white rounded-xl shadow-sm p-6 overflow-y-auto max-h-10/12">
      <div className="flex flex-1 items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#32418C]">{`${userDepartment} List`}</h1>
        <button
          onClick={handleOpen}
          className="flex items-center bg-[#32418C] text-white px-6 py-3 rounded-lg hover:bg-[#1e2a5f] transition"
        >
          <UserPlus2 className="inline-block mr-2 w-5" />
          Add User
        </button>
      </div>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        disableSelectionOnClick
      />
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={handleClose}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-[#32418C] text-center">
              {isEditing ? "Edit User" : "Add User"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveUser();
              }}
              autoComplete="off"
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#32418C]"
                  value={newUser.firstName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#32418C]"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#32418C] appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill=\'none\' stroke=\'%2332418C\' stroke-width=\'2\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'></path></svg>')] bg-no-repeat bg-[right_1rem_center]"
                  value={newUser.type}
                  onChange={(e) => {
                    const type = e.target.value;
                    const department =
                      type === "System Admin"
                        ? "System Admin"
                        : type === "Student"
                        ? "Student"
                        : "";
                    setNewUser((prev) => ({
                      ...prev,
                      type,
                      department,
                    }));
                  }}
                  required
                  disabled={localStorage.getItem("userType") === "Head"}
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  {userTypes.map((type) => (
                    (localStorage.getItem("userType") === "Head" && type !== "Staff") ? null : (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  ))}
                </select>
              </div>
              {/* Only show department if not System Admin */}
              {newUser.type !== "System Admin" &&
                newUser.type !== "Student" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#32418C] appearance-none bg-[url('data:image/svg+xml;utf8,<svg fill=\'none\' stroke=\'%2332418C\' stroke-width=\'2\' viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'><path stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'M19 9l-7 7-7-7\'></path></svg>')] bg-no-repeat bg-[right_1rem_center]"
                      value={newUser.department}
                      onChange={(e) =>
                        setNewUser({ ...newUser, department: e.target.value })
                      }
                      required
                      disabled={localStorage.getItem("userType") === "Head"}
                    >
                      <option value="" disabled>
                        Select department
                      </option>
                      {departments.map((dep) => (
                        (localStorage.getItem("userType") === "Head" && dep !== userDepartment) ? null : (
                          <option key={dep} value={dep}>
                            {dep}
                          </option>
                        )
                      ))}
                    </select>
                  </div>
                )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#32418C]"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#32418C]"
                  value={newUser.contactNumber}
                  onChange={(e) =>
                    setNewUser({ ...newUser, contactNumber: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#32418C]"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  required={!isEditing}
                  placeholder={
                    isEditing ? "Leave blank to keep current password" : ""
                  }
                />
                {isEditing && (
                  <span className="text-xs text-gray-400">
                    Leave blank to keep current password
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={newUser.isActive}
                  onChange={(e) =>
                    setNewUser({ ...newUser, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-[#32418C] border-gray-300 rounded focus:ring-[#32418C]"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg bg-[#32418C] text-white hover:bg-[#1e2a5f] flex items-center justify-center ${
                    modalLoading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                  disabled={modalLoading}
                >
                  {modalLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : isEditing ? (
                    "Save Changes"
                  ) : (
                    "Add User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashUserListPage;
