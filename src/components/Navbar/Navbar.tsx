"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-300 text-black h-20 shadow-md fixed top-0 left-0 w-full px-8 py-6 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-xl font-bold">
          <Link href="/">Travel Go</Link>
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 font-medium">
          <li><Link href="/" className="hover:text-gray-200">Home</Link></li>
          <li><Link href="/about" className="hover:text-gray-200">About</Link></li>
          <li><Link href="/services" className="hover:text-gray-200">Services</Link></li>
          <li><Link href="/contact" className="hover:text-gray-200">Contact</Link></li>
        </ul>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <span className="text-2xl">✖</span>
          ) : (
            <span className="text-2xl">☰</span>
          )}
        </button>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="flex flex-col gap-5 mt-4 pb-5 font-medium md:hidden">
          <li><Link href="/" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link href="/about" onClick={() => setIsOpen(false)}>About</Link></li>
          <li><Link href="/services" onClick={() => setIsOpen(false)}>Services</Link></li>
          <li><Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link></li>
        </ul>
      )}
    </nav>
  );
}
