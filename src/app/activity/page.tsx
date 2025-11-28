// "use client";

// import { useState } from "react";
// import useSocket from "@/hooks/usesocket";

// export default function ActivityFeed() {
//   const [activity, setActivity] = useState<any[]>([]);

//   useSocket((type, data) => {
//     setActivity((prev) => [
//       { type, data, time: new Date().toLocaleTimeString() },
//       ...prev,
//     ]);
//   });

//   return (
//     <div className="p-4 border rounded text-black">
//       <h2 className="font-bold text-xl mb-2">Live Activity Feed</h2>
//       {activity.map((item, idx) => (
//         <div key={idx} className="p-2 border-b">
//           <b>{item.type}</b>: {JSON.stringify(item.data)}
//           <div className="text-sm text-gray-600">{item.time}</div>
//         </div>
//       ))}
//     </div>
//   );
// }
