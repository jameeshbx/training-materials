"use client";

import { useRouter } from "next/navigation";
import InviteForm from "@/components/inviteform";

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <button
        onClick={() => router.push("/admin/users")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        View Users
      </button>

      <button
        onClick={() => router.push("/admin/audit-logs")}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Audit logs
      </button>
      <div className="max-w-3xl mx-auto p-6">
<InviteForm  />
      </div>
    </div>

    
  );
  
}

// import InviteForm from "@/components/inviteform";

// export default function AdminPage() {
//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       <InviteForm />
//     </div>
//   );
// }