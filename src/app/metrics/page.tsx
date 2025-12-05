// 'use client';

// import { useEffect, useState } from "react";

// export default function MetricsDashboard() {
//   const [health, setHealth] = useState<any>(null);

//   useEffect(() => {
//     fetch("/api/health")
//       .then(res => res.json())
//       .then(data => setHealth(data));
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>📊 Metrics Dashboard</h1>

//       <section style={{ marginTop: "20px" }}>
//         <h2>Health Status</h2>
//         {health ? (
//           <pre>{JSON.stringify(health, null, 2)}</pre>
//         ) : (
//           "Loading..."
//         )}
//       </section>

//       <section style={{ marginTop: "20px" }}>
//         <h2>Server Metrics</h2>
//         <p>More metrics can be added later (CPU, RAM, logs, etc.)</p>
//       </section>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";

export default function HealthDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((d) => setData(d));
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>System Health Status</h1>
      <div style={{
        marginTop: "20px",
        padding: "20px",
        background: "#463131ff",
        borderRadius: "10px",
        width: "350px"
      }}>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Time:</strong> {data.time}</p>
      </div>
    </div>
  );
}