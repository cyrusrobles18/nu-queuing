import { createContext, useState, useEffect, useContext } from 'react';

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [windows, setWindows] = useState(3);
  const [queue, setQueue] = useState(101);
  const [serving, setServing] = useState(
    Array.from({ length: 4 }, (_, i) => ({ id: i + 1, number: null }))
  );
  const [recent, setRecent] = useState(null);

  // Debug: Log state on every render
  console.log('[QueueProvider] render', { windows, queue, serving, recent });

  // Update serving windows when window count changes
  useEffect(() => {
    setServing(prevServing => {
      if (windows > prevServing.length) {
        // Add new windows
        const newWindows = [...prevServing];
        for (let i = prevServing.length; i < windows; i++) {
          newWindows.push({ id: i + 1, number: null });
        }
        console.log('[QueueProvider] Added windows:', newWindows);
        return newWindows;
      } else if (windows < prevServing.length) {
        // Remove extra windows
        const sliced = prevServing.slice(0, windows);
        console.log('[QueueProvider] Removed windows:', sliced);
        return sliced;
      }
      return prevServing;
    });
  }, [windows]);

  const callNext = () => {
    setServing(prevServing => {
      // Find first available window
      const availableWindow = prevServing.find(w => w.number === null);
      let targetWindow;
      if (availableWindow) {
        targetWindow = availableWindow;
      } else {
        // If all busy, rotate based on queue number
        targetWindow = prevServing[queue % prevServing.length];
      }
      const newServing = prevServing.map(w =>
        w.id === targetWindow.id ? { ...w, number: queue } : w
      );
      console.log('[QueueProvider] callNext', { queue, targetWindow, newServing });
      setRecent(queue);
      setQueue(q => q + 1);
      return newServing;
    });
  };

  return (
    <QueueContext.Provider value={{
      windows,
      setWindows,
      queue,
      serving,
      recent,
      callNext
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueueContext = () => {
  const ctx = useContext(QueueContext);
  console.log('[useQueueContext] context value:', ctx);
  return ctx;
};