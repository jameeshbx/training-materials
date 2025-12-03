import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(
  userId?: string,
  userName?: string,
  onActivity?: (activity: any) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
        transports: ["websocket", "polling"],
      });

      socketRef.current.on("connect", () => {
        console.log("✅ Socket connected:", socketRef.current?.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("❌ Socket disconnected");
      });

      // Listen for activity events
      socketRef.current.on("activityCreated", (activity) => {
        console.log("📢 New activity:", activity);
        if (onActivity) {
          onActivity(activity);
        }
      });

      // Listen for task events (optional)
      socketRef.current.on("taskCreated", (task) => {
        console.log("📢 Task created:", task);
      });

      socketRef.current.on("taskUpdated", (task) => {
        console.log("📢 Task updated:", task);
      });

      socketRef.current.on("taskDeleted", (task) => {
        console.log("📢 Task deleted:", task);
      });
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, userName, onActivity]);

  return socketRef.current;
}