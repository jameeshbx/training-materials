export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="p-6 rounded-xl border border-gray-700 bg-gray-900">
        <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
        <p className="text-gray-400">You do not have permission to view this page.</p>
      </div>
    </div>
  );
}
