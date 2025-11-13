"use client"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-20">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Column 1 */}
        <div>
          <h2 className="text-2xl font-bold mb-3">TravelGo</h2>
          <p className="text-gray-400">
            Explore the world with our amazing travel packages.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="text-gray-400 space-y-2">
            <li>Home</li>
            <li>About</li>
            <li>Packages</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Services</h3>
          <ul className="text-gray-400 space-y-2">
            <li>Travel Booking</li>
            <li>Hotel Reservation</li>
            <li>Guide Assistance</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4 text-gray-400 text-xl">
            <a href="#">🌐</a>
            <a href="#">📘</a>
            <a href="#">📸</a>
            <a href="#">▶️</a>
          </div>
        </div>

      </div>

      <hr className="border-gray-700 mt-8" />

      <p className="text-center text-gray-500 mt-5">
        © {new Date().getFullYear()} TravelGo. All Rights Reserved.
      </p>
    </footer>
  );
}
