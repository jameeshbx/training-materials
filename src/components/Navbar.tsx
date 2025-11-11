"use client"; // tells Next.js this is a client component

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left side - logo or title */}
        <h1 className="text-2xl font-bold tracking-wide">My Next App</h1>

        {/* Right side - links */}
        <ul className="flex space-x-6 text-lg">
          <li>
            <a href="/" className="hover:text-yellow-300 transition-colors">
              Home
            </a>
          </li>
          
        </ul>
      </div>
    </nav>
  );
}
