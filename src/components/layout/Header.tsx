"use client";
import LogoutButton from "@/components/LogoutButton";


interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <div className="flex items-center justify-between w-full">
      {/* Mobile toggle button */}
      <button
        className="lg:hidden text-2xl text-gray-700"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <h1 className="text-lg font-semibold text-gray-800">header</h1>


       <div>
        <LogoutButton />
      </div>
    </div>
  );
}
