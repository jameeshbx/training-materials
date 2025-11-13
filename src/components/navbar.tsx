"use client";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-800 text-white shadow-md py-3">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        {/* Left side - logo or title */}
        <h1 className="text-2xl font-semibold tracking-wide">My Next App</h1>

        {/* Right side - (optional) links or buttons */}
        {/* <ul className="flex space-x-6 text-lg">
          <li>
            <a
              href="/"
              className="hover:text-yellow-300 transition-colors duration-200"
            >
              Home
            </a>
          </li>
        </ul> */}
      </div>
    </nav>
  );
}
