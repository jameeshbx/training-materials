export default function HomePage() {
  return (
    <div className="flex justify-center ">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-white/20">
        <h2 className="text-2xl font-bold mb-6 text-white">Sign In</h2>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-md bg-gray-700/50 border border-gray-600 placeholder-gray-300 text-white focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-md bg-gray-700/50 border border-gray-600 placeholder-gray-300 text-white focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold"
          >
            Login
          </button>

          <button
            type="button"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-md font-semibold"
          >
            Register
          </button>
        </form>

      </div>
    </div>
  );
}
