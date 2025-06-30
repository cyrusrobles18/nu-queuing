import { useEffect, useState } from "react";
import QueueList from "../../components/QueueList";
import { fetchQueuesByDepartment, updateQueueStatus } from "../../services/QueueService";
import { useQueueSocket } from "../../hooks/useQueueSocket";

const DashControlPage = () => {
  const [queue, setQueue] = useState({
    current: null,
    regular: [],
    priority: [],
  });
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(null);

  // Get department from localStorage
  const department = localStorage.getItem("userDepartment") || "";
  // console.log(department.toLowerCase());
  const loadQueue = async () => {
    if (!department) return;
    setLoading(true);
    try {
      const { data } = await fetchQueuesByDepartment(department.toLowerCase());
      // Find the current processing queue
      const processingQueue = Array.isArray(data)
        ? data.find(q => q.status === "Processing")
        : null;
      // Exclude 'Done' queues from lists and exclude the current processing queue from the lists
      const regular = Array.isArray(data)
        ? data.filter(q => !q.priority && q.status !== "Done" && q.status !== "Processing").map(q => q.queueNumber)
        : [];
      const priority = Array.isArray(data)
        ? data.filter(q => q.priority && q.status !== "Done" && q.status !== "Processing").map(q => q.queueNumber)
        : [];
      setQueue({
        current: processingQueue ? processingQueue.queueNumber : null,
        regular,
        priority,
      });
      console.log("Queue loaded:", data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    // Poll for new queues every 2 seconds for real-time updates
    // const interval = setInterval(() => {
    //   loadQueue();
    // }, 2000);
    // return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [department]);

  // Real-time queue updates via websocket
  useQueueSocket(department, loadQueue);

  // Helper to get the current processing queue (if any)
  const getCurrentProcessingQueue = (data) => {
    if (!Array.isArray(data)) return null;
    return data.find(q => q.status === "Processing");
  };

  // Helper to get the next waiting queue (regular or priority)
  const getNextWaitingQueue = (data, isPriority = false) => {
    if (!Array.isArray(data)) return null;
    return data.find(q => q.status === "Waiting" && q.priority === isPriority);
  };

  // Call next queue: mark current as Done, next as Processing
  const handleCallNext = async () => {
    setLoading(true);
    try {
      const { data } = await fetchQueuesByDepartment(department.toLowerCase());
      const currentProcessing = getCurrentProcessingQueue(data);
      const nextWaiting = getNextWaitingQueue(data, false); // regular queue
      // Mark current as Done
      if (currentProcessing) {
        await updateQueueStatus(currentProcessing._id, "Done");
      }
      // Mark next as Processing
      if (nextWaiting) {
        await updateQueueStatus(nextWaiting._id, "Processing");
      }
      await loadQueue();
    } finally {
      setLoading(false);
    }
  };
 
  // Select a priority queue: mark current as Done, selected as Processing
  const handleSelectPriority = async (num) => {
    setSelecting(num);
    try {
      const { data } = await fetchQueuesByDepartment(department.toLowerCase());
      const currentProcessing = getCurrentProcessingQueue(data);
      const selectedPriority = data.find(q => q.queueNumber === num && q.priority);
      // Mark current as Done
      if (currentProcessing) {
        await updateQueueStatus(currentProcessing._id, "Done");
      }
      // Mark selected as Processing
      if (selectedPriority) {
        await updateQueueStatus(selectedPriority._id, "Processing");
      }
      await loadQueue();
    } finally {
      setSelecting(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center w-full max-w-4xl gap-8">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold text-[#32418C] mb-2">
            Current Queue
          </h2>
          <div className="text-7xl font-extrabold text-[#32418C] bg-white rounded-2xl p-24 flex items-center justify-center shadow-lg border-4 border-[#32418C]/30 mb-4 transition-all duration-300">
            {queue.current || "---"}
          </div>
          <button
            onClick={handleCallNext}
            disabled={loading}
            className="bg-[#1e7e34] hover:bg-[#156328] text-white px-8 py-4 rounded-lg font-bold text-xl transition shadow-md disabled:opacity-60"
          >
            {loading ? "Loading..." : "Next"}
          </button>
        </div>
        <div className="flex w-full gap-8">
          <div className="flex-1">
            <QueueList
              title="Regular Queue"
              list={queue.regular}
              selectable={false}
            />
          </div>
          <div className="flex-1">
            <QueueList
              title="Priority List"
              list={queue.priority}
              selectable={true}
              onSelect={handleSelectPriority}
            />
            {selecting && (
              <div className="text-center text-sm text-gray-500 mt-2">
                Selecting {selecting}...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashControlPage;
