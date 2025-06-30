import { useEffect, useState } from "react";
import {
  fetchWindowsByDepartment,
  createWindow,
  updateWindow,
} from "../../services/WindowService";
import { DataGrid } from "@mui/x-data-grid";
import { Pencil, ToggleLeft, ToggleRight } from "lucide-react";
import { useQueueSocket } from "../../hooks/useQueueSocket";
const DashWindowList = () => {
  const [windows, setWindows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editWindowId, setEditWindowId] = useState(null);
  const userDepartment = localStorage.getItem("userDepartment");
  const userType = localStorage.getItem("userType");
  const [modalLoading, setModalLoading] = useState(false);
  const [newWindow, setNewWindow] = useState({
    windowNumber: "",
    department: userDepartment.toLowerCase() || "",
    transaction: "",
    isActive: true,
  });

  const loadWindows = async () => {
    setLoading(true);
    try {
      if (userType === "Head" && userDepartment) {
        const { data } = await fetchWindowsByDepartment(userDepartment.toLowerCase());
        setWindows(data.windows || []);
      } else {
        setWindows([]); // Only Head can access
      }
    } catch (err) {
      setWindows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWindows();
    // eslint-disable-next-line
  }, []);

  useQueueSocket(userDepartment, loadWindows, "window");

  const handleOpen = () => {
    setIsEditing(false);
    setNewWindow({
      windowNumber: "",
      department: userDepartment.toLowerCase() || "",
      transaction: "",
      isActive: true,
    });
    setOpen(true);
  };

  const handleEdit = (id) => {
    const window = windows.find((w) => w._id === id);
    if (window) {
      setNewWindow({ ...window });
      setEditWindowId(id);
      setIsEditing(true);
      setOpen(true);
    }
  };

  const handleSaveWindow = async () => {
    setModalLoading(true);
    try {
      if (isEditing) {
        await updateWindow(editWindowId, newWindow);
      } else {
        await createWindow(newWindow);
      }
      await loadWindows();
      setOpen(false);
      setIsEditing(false);
      setEditWindowId(null);
    } catch (err) {
      // Optionally handle error
    } finally {
      setModalLoading(false);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await updateWindow(id, { isActive: !isActive });
      loadWindows();
    } catch (err) {}
  };

  if (userType !== "Head") {
    return (
      <div className="text-center text-lg text-gray-500 mt-10">
        Access denied. Only Department Heads can manage windows.
      </div>
    );
  }

  const columns = [
    { field: "windowNumber", headerName: "Window Number", flex: 1 },
    { field: "transaction", headerName: "Transaction", flex: 1 },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: (params) =>
        params.row.isActive ? (
          <span className="text-green-600 font-semibold">Active</span>
        ) : (
          <span className="text-gray-400">Inactive</span>
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="flex-col items-center gap-2">
          <button
            onClick={() => handleEdit(params.row._id)}
            className="p-1 rounded text-nu-gold hover:text-nu-blue"
            title="Edit"
            aria-label="Edit"
          >
            <Pencil size={20} />
          </button>
          <button
            onClick={() =>
              handleToggleActive(params.row._id, params.row.isActive)
            }
            className={`p-1 rounded  ${
              params.row.isActive
                ? "text-green-600 hover:text-green-800"
                : "text-gray-400 hover:text-nu-blue"
            }`}
            title={params.row.isActive ? "Deactivate" : "Activate"}
            aria-label={params.row.isActive ? "Deactivate" : "Activate"}
          >
            {params.row.isActive ? (
              <ToggleLeft size={20} />
            ) : (
              <ToggleRight size={20} />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 overflow-y-auto max-h-10/12">
      <div className="flex flex-1 items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-[#32418C]">
          {userDepartment} Windows
        </h1>
        <button
          onClick={handleOpen}
          className="flex items-center bg-[#32418C] text-white px-6 py-3 rounded-lg hover:bg-[#1e2a5f] transition"
        >
          + Add Window
        </button>
      </div>
      <DataGrid
        rows={windows}
        columns={columns}
        getRowId={(row) => row._id}
        loading={loading}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        disableSelectionOnClick
        autoHeight
      />
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              onClick={() => setOpen(false)}
              aria-label="Close"
              type="button"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-[#32418C] text-center">
              {isEditing ? "Edit Window" : "Add Window"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveWindow();
              }}
              autoComplete="off"
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Window Number
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#32418C]"
                  value={newWindow.windowNumber}
                  onChange={(e) =>
                    setNewWindow({
                      ...newWindow,
                      windowNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#32418C]"
                  value={newWindow.transaction}
                  onChange={(e) =>
                    setNewWindow({
                      ...newWindow,
                      transaction: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={newWindow.isActive}
                  onChange={(e) =>
                    setNewWindow({ ...newWindow, isActive: e.target.checked })
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
                  onClick={() => setOpen(false)}
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
                  {modalLoading
                    ? "Saving..."
                    : isEditing
                    ? "Save Changes"
                    : "Add Window"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashWindowList;
