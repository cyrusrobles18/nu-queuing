import { useEffect, useState } from "react";
import QueueList from "../../components/QueueList";
import { fetchQueuesByDepartment, updateQueueStatus, updateQueueWindowNumber, updateTransaction } from "../../services/QueueService";
import { useQueueSocket } from "../../hooks/useQueueSocket";

const DashControlPage = () => {
  const [queue, setQueue] = useState({
    current: null,
    regular: [],
    priority: [],
  });
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(null);
  const [warning, setWarning] = useState("");

  // Get department from localStorage
  const department = localStorage.getItem("userDepartment") || "";
  const windowNumber = localStorage.getItem("windowNumber") || "";
  // console.log(department.toLowerCase());
  const loadQueue = async () => {
    if (!department) return;
    setLoading(true);
    try {
      const { data } = await fetchQueuesByDepartment(department.toLowerCase());
      // Find the current processing queue for this window or unassigned
      const processingQueue = Array.isArray(data)
        ? data.find(q => q.status === "Processing" && (q.windowNumber === windowNumber || !q.windowNumber || q.windowNumber === ""))
        : null;
      // Exclude 'Done' queues from lists and exclude the current processing queue from the lists
      const regular = Array.isArray(data)
        ? data.filter(q => !q.priority && q.status !== "Done" && q.status !== "Processing").map(q => q.queueNumber)
        : [];
      const priority = Array.isArray(data)
        ? data.filter(q => q.priority && q.status !== "Done" && q.status !== "Processing").map(q => q.queueNumber)
        : [];
      setQueue({
        current: processingQueue ? processingQueue.queueNumber : "",
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
    // Prefer queue assigned to this window, else any unassigned processing queue
    return data.find(q => q.status === "Processing" && (q.windowNumber === windowNumber || !q.windowNumber || q.windowNumber === ""));
  };

  // Helper to get the next waiting queue (regular or priority)
  const getNextWaitingQueue = (data, isPriority = false) => {
    if (!Array.isArray(data)) return null;
    return data.find(q => q.status === "Waiting" && q.priority === isPriority);
  };

  // Enrollment flow steps
  const enrollmentFlow = [
    { department: "registrar", transaction: "Request Assessment" },
    { department: "treasury", transaction: "Payment for Enrollment" },
    { department: "registrar", transaction: "Request COR" },
  ];

  // Helper to get the next step in the enrollment flow
  const getNextEnrollmentStep = (currentDept, currentTransaction) => {
    const idx = enrollmentFlow.findIndex(
      step => step.department === currentDept && step.transaction === currentTransaction
    );
    if (idx >= 0 && idx < enrollmentFlow.length - 1) {
      return enrollmentFlow[idx + 1];
    }
    return null;
  };

  // Call next queue: mark current as Done, next as Processing, assign to window
  const handleCallNext = async () => {
    setLoading(true);
    setWarning("");
    try {
      const { data } = await fetchQueuesByDepartment(department.toLowerCase());
      const currentProcessing = getCurrentProcessingQueue(data);
      // Find the next waiting regular queue WITHOUT windowNumber
      const nextWaiting = Array.isArray(data)
        ? data.find(q => !q.priority && q.status !== "Done" && q.status !== "Processing" && (!q.windowNumber || q.windowNumber === ""))
        : null;
      if (!nextWaiting) {
        // Mark current as Done and clear current queue display
        if (currentProcessing) {
          // Enrollment flow logic
          if (
            currentProcessing.originalTransaction === "Enrollment" ||
            currentProcessing.transaction === "Enrollment"
          ) {
            // If the original transaction or current transaction is Enrollment, start the flow
            let currentStep = enrollmentFlow.find(
              step => step.department === department.toLowerCase() && step.transaction === currentProcessing.transaction
            );
            // If not in flow yet, start at first step
            if (!currentStep) {
              await updateTransaction(currentProcessing._id, enrollmentFlow[0].transaction, enrollmentFlow[0].department);
              setWarning(`Enrollment flow started: Forwarded to ${enrollmentFlow[0].department} for ${enrollmentFlow[0].transaction}.`);
            } else {
              const nextStep = getNextEnrollmentStep(
                department.toLowerCase(),
                currentProcessing.transaction
              );
              if (nextStep) {
                await updateQueueStatus(currentProcessing._id, "Waiting");
                await updateQueueWindowNumber(currentProcessing._id, "");
                await updateTransaction(currentProcessing._id, nextStep.transaction, nextStep.department);
                setWarning(
                  `Forwarded to ${nextStep.department} for ${nextStep.transaction}.`
                );
              } else {
                // End of flow
                await updateQueueStatus(currentProcessing._id, "Done");
                setWarning("Enrollment flow completed.");
              }
            }
          } else if (
            currentProcessing.transaction === "Request Assessment" ||
            currentProcessing.transaction === "Payment for Enrollment" ||
            currentProcessing.transaction === "Request COR"
          ) {
            // fallback for legacy queues already in flow
            const nextStep = getNextEnrollmentStep(
              department.toLowerCase(),
              currentProcessing.transaction
            );
            if (nextStep) {
              await updateQueueStatus(currentProcessing._id, "Waiting");
              await updateQueueWindowNumber(currentProcessing._id, "");
              await updateTransaction(currentProcessing._id, nextStep.transaction, nextStep.department);
              setWarning(
                `Forwarded to ${nextStep.department} for ${nextStep.transaction}.`
              );
            } else {
              // End of flow
              await updateQueueStatus(currentProcessing._id, "Done");
              setWarning("Enrollment flow completed.");
            }
          } else {
            await updateQueueStatus(currentProcessing._id, "Done");
          }
        }
        setQueue(q => ({ ...q, current: "" }));
        setWarning("No available regular queue without assigned window.");
        setLoading(false);
        return;
      }
      // Mark current as Done
      if (currentProcessing) {
        await updateQueueStatus(currentProcessing._id, "Done");
      }
      // Mark next as Processing
      await updateQueueStatus(nextWaiting._id, "Processing");
      // Assign to window if windowNumber exists
      if (windowNumber) {
        await updateQueueWindowNumber(nextWaiting._id, windowNumber);
      }
      await loadQueue();
    } finally {
      setLoading(false);
    }
  };

  // Select a priority queue: mark current as Done, selected as Processing, assign to window
  const handleSelectPriority = async (num) => {
    setSelecting(num);
    setWarning("");
    try {
      const { data } = await fetchQueuesByDepartment(department.toLowerCase());
      const currentProcessing = getCurrentProcessingQueue(data);
      // Find the selected priority queue by number, only if it does NOT have windowNumber
      const selectedPriority = data.find(q => q.queueNumber === num && q.priority && (!q.windowNumber || q.windowNumber === ""));
      if (!selectedPriority) {
        setWarning("Cannot select this priority queue: already assigned to a window.");
        return;
      }
      // Mark current as Done
      if (currentProcessing) {
        await updateQueueStatus(currentProcessing._id, "Done");
      }
      // Mark selected as Processing
      await updateQueueStatus(selectedPriority._id, "Processing");
      // Assign to window if windowNumber exists
      if (windowNumber) {
        await updateQueueWindowNumber(selectedPriority._id, windowNumber);
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
          {warning && (
            <div className="text-red-500 font-semibold mb-2">{warning}</div>
          )}
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
