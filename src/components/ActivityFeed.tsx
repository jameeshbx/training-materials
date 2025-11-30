

// "use client";

// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { toast } from "sonner";  // ⭐ NEW: popup notification

// const socket = io("http://localhost:4000", {
//     transports: ["websocket"],
//     autoConnect: true,
//     reconnection: true,
//     reconnectionAttempts: Infinity,
//     reconnectionDelay: 500,
// });

// type Activity = {
//     message: string;
//     userName: string;
//     createdAt: string;
// };

// export default function ActivityFeed({ teamId }: { teamId: string }) {
//     const [activities, setActivities] = useState<Activity[]>([]);

//     // 🔥 1️⃣ Listen to live activity updates FIRST
//     useEffect(() => {
//         socket.emit("join_team", teamId);

//         const handler = (activity: Activity) => {
//             console.log("🔴 Live activity received:", activity);

//             // ⭐ SHOW POPUP
//             toast(activity.message, {
//                 description: activity.userName,
//             });

//             // Add to activity list
//             setActivities((prev) => [activity, ...prev]);
//         };

//         socket.on("activity", handler);

//         return () => {
//             socket.off("activity", handler);
//         };
//     }, [teamId]);

//     // 🔥 2️⃣ Load existing activities AFTER listener is ready
//     useEffect(() => {
//         async function loadInitial() {
//             try {
//                 const res = await fetch(`/api/activity?teamId=${teamId}`);
//                 const data = await res.json();
//                 setActivities(data);
//             } catch (err) {
//                 console.error("Failed to load initial activities:", err);
//             }
//         }

//         setTimeout(loadInitial, 300); // small delay to prevent race condition
//     }, [teamId]);

//     return (
//         <div className="space-y-2">
//             <h2 className="text-lg font-semibold">Team Activity</h2>

//             <div className="max-h-80 overflow-y-auto border rounded-md p-3 text-sm">
//                 {activities.length === 0 && (
//                     <p className="text-muted-foreground">No activity yet</p>
//                 )}

//                 {activities.map((a, i) => (
//                     <div key={i} className="border-b last:border-b-0 py-2">
//                         <div className="font-medium">{a.message}</div>
//                         <div className="text-xs text-muted-foreground">
//                             {a.userName} •{" "}
//                             {new Date(a.createdAt).toLocaleTimeString([], {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                             })}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";  // ⭐ popup notification

const socket = io("http://localhost:4000", {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
});

type Activity = {
    message: string;
    userName: string;
    createdAt: string;
};

export default function ActivityFeed({ teamId }: { teamId: string }) {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        socket.emit("join_team", teamId);

        // 🔥 Existing activity feed handler
        const activityHandler = (activity: Activity) => {
            console.log("🔴 Live activity received:", activity);

            // Existing popup for activity (keep it)
            toast(activity.message, {
                description: activity.userName,
            });

            // Add to activity list
            setActivities((prev) => [activity, ...prev]);
        };

        // ⭐ NEW popup-only handler (does NOT touch activity feed)
        const popupHandler = (data: any) => {
            if (data?.message) {
                toast.info(data.message, {
                    position: "top-right",
                });
            }
        };

        socket.on("activity", activityHandler);
        socket.on("popup", popupHandler);

        return () => {
            socket.off("activity", activityHandler);
            socket.off("popup", popupHandler);
        };
    }, [teamId]);

    useEffect(() => {
        async function loadInitial() {
            try {
                const res = await fetch(`/api/activity?teamId=${teamId}`);
                const data = await res.json();
                setActivities(data);
            } catch (err) {
                console.error("Failed to load initial activities:", err);
            }
        }

        // small delay avoids race condition
        setTimeout(loadInitial, 300);
    }, [teamId]);

    return (
        <div className="space-y-2">
            <h2 className="text-lg font-semibold">Team Activity</h2>

            <div className="max-h-80 overflow-y-auto border rounded-md p-3 text-sm">
                {activities.length === 0 && (
                    <p className="text-muted-foreground">No activity yet</p>
                )}

                {activities.map((a, i) => (
                    <div key={i} className="border-b last:border-b-0 py-2">
                        <div className="font-medium">{a.message}</div>
                        <div className="text-xs text-muted-foreground">
                            {a.userName} •{" "}
                            {new Date(a.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


