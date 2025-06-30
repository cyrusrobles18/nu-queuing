import { useEffect, useState, useCallback } from "react";
import { useQueueSocket } from "../../hooks/useQueueSocket";
import { fetchQueuesByDepartment } from "../../services/QueueService";
import { fetchWindowsByDepartment } from "../../services/WindowService";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DisplayPage = () => {
  const [processing, setProcessing] = useState(null);
  const [windowCount, setWindowCount] = useState(0);
  const [windowList, setWindowList] = useState([]);
  const navigate = useNavigate();

  // Get department from localStorage
  const department = localStorage.getItem("userDepartment") || "";
  // To lowecase
  // department.toLowerCase();
  // Unified data loader for websocket and initial load
  const loadData = useCallback(async () => {
    if (!department) return;
    try {
      // Fetch queues
      const { data: queueData } = await fetchQueuesByDepartment(
        department.toLowerCase()
      );
      if (Array.isArray(queueData)) {
        const current = queueData.find((q) => q.status === "Processing");
        setProcessing(current ? current.queueNumber : null);
      } else {
        setProcessing(null);
      }
      // Fetch windows
      const { data: windowData } = await fetchWindowsByDepartment(
        department.toLowerCase()
      );
      if (windowData && Array.isArray(windowData.windows)) {
        setWindowList(windowData.windows);
        setWindowCount(windowData.windows.filter((w) => w.isActive).length);
      } else {
        setWindowList([]);
        setWindowCount(0);
      }
    } catch {
      setProcessing(null);
      setWindowList([]);
      setWindowCount(0);
    }
  }, [department]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [loadData]);

  // Real-time updates via websocket
  useQueueSocket(department, loadData, "queue");
  useQueueSocket(department, loadData, "window");

  return (
    <div className="min-h-screen bg-white overflow-hidden relative font-clan-ot">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-6 left-8 z-50 bg-nu-blue text-white rounded-full w-10 h-10 shadow-md flex items-center justify-center text-2xl font-semibold transition-transform hover:bg-nu-blue-dark hover:scale-105"
        aria-label="Back"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      {/* Background elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-[#32418C] rounded-full top-[-180px] left-[-180px] blur-[40px] opacity-20"></div>
        <div className="absolute w-[400px] h-[400px] bg-[#FBD117] rounded-full bottom-[-120px] right-[-120px] blur-[40px] opacity-20"></div>
        <div className="absolute w-[300px] h-[300px] bg-[#32418C] rounded-full bottom-[10%] left-[10%] blur-[40px] opacity-9"></div>
        <div className="absolute w-[200px] h-[200px] bg-[#FBD117] rounded-full top-[20%] right-[15%] blur-[40px] opacity-9"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen w-full p-6 box-border">
        {/* Header */}
        <div className="text-center mb-4 md:mb-8">
          <img
            src="/src/assets/images/nulogohorizontal-blue.jpg"
            alt="NU Logo"
            className="max-w-[300px] md:max-w-[400px] mx-auto mb-3 md:mb-5"
          />
          <h1 className="text-[#32418C] text-3xl md:text-5xl font-bold tracking-wider">
            Live Queue Status
          </h1>
          {/* {processing && (
            <div className="mt-2 text-lg text-nu-gold font-semibold">
              Now Processing: <span className="font-bold">{processing}</span>
            </div>
          )} */}
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center flex-col md:flex-row gap-8 w-full ">
          {/* Recent Queue Display */}
          <div className="w-full max-w-4xl flex flex-col items-center md:mb-4">
            <div className="text-center">
              <h2 className="text-3xl text-[#32418C] font-semibold mb-4">
                Now Serving
              </h2>
              <div className="text-9xl px-20 py-30 md:text-9xl font-bold text-[#32418C] bg-white/80 rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#32418C]/30">
                {processing || "---"}
              </div>
              {/* Window Count Display */}
              <div className="mt-6 text-lg text-gray-700 font-medium">
                Available Windows:{" "}
                <span className="font-bold">{windowCount}</span>
              </div>
            </div>
          </div>
          {/* Service Windows */}
          <div className="w-full items-center justify-center  ">
            <h3 className="text-[#32418C] text-xl md:text-2xl font-semibold text-center mb-4">
              Service Windows
            </h3>
            <div
              className={`grid gap-4 justify-self-center ${
                windowList.filter((w) => w.isActive).length <= 8
                  ? "grid-cols-2 md:grid-cols-4"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              }`}
            >
              {windowList
                .filter((window) => window.isActive)
                .map((window) => (
                  <div
                    key={window._id}
                    className="bg-white/90 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center shadow-lg border-2 border-[#32418C]/20"
                  >
                    <h3 className="text-[#32418C] text-lg font-medium mb-2">
                      Window #{window.windowNumber}
                    </h3>
                    <div className="text-3xl md:text-4xl font-bold text-[#32418C] bg-white p-10 flex items-center justify-center rounded-lg border-2 border-[#32418C]/30">
                      Active
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {window.transaction}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPage;
