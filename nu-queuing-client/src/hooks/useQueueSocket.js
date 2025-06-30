// Socket.io client for real-time updates
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import constants from "../constants";

/**
 * @param {string} department - Department name
 * @param {function} onUpdate - Callback to run on event
 * @param {string} eventType - 'queue' or 'window' (default: 'queue')
 */
export function useQueueSocket(department, onUpdate, eventType = "queue") {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!department) return;
    // Remove '/api' from HOST if present
    let socketHost = constants.HOST;
    if (socketHost.endsWith("/api")) {
      socketHost = socketHost.slice(0, -4);
    }
    const socket = io(socketHost);
    socketRef.current = socket;
    // Listen for the specified event type for this department
    const eventName = eventType + ":update";
    socket.on(eventName, (payload) => {
      if (payload.department && payload.department.toLowerCase() === department.toLowerCase()) {
        onUpdate();
      }
    });
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [department, eventType]);
}
