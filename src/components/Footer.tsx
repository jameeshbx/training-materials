"use client"

import { Heart, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-0.5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">MP</span>
            </div>
            <span className="font-semibold text-sm">My Page</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>

          {/* Social & Copyright */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            
            <div className="w-px h-4 bg-gray-700"></div>
            
            <p className="text-xs text-gray-500 flex items-center space-x-1">
              <span>© {new Date().getFullYear()}</span>
              <Heart className="w-3 h-3 text-red-500 fill-current" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}