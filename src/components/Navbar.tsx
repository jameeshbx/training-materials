"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  // Language options with flags
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸", nativeName: "English" },
    { code: "ml", name: "Malayalam", flag: "🇮🇳", nativeName: "മലയാളം" },
   
  ];

  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split("/").filter(Boolean);
    
    if (segments.length > 0 && languages.some(lang => lang.code === segments[0])) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }
    
    const newPath = "/" + segments.join("/");
    router.push(newPath);
    setLanguageOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest(".language-switcher")) {
        setLanguageOpen(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-b from-sky-400 to-sky-500 text-black h-20 shadow-lg fixed top-0 left-0 w-full px-6 py-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-sky-600 font-bold text-lg">M</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
            <Link href="/">MyPage</Link>
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 font-medium">
          <li>
            <Link 
              href={`/${currentLocale}`} 
              className="hover:text-white transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href={`/${currentLocale}/dashboard`} 
              className="hover:text-white transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              href={`/${currentLocale}/contact`} 
              className="hover:text-white transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
            >
              Contact
            </Link>
          </li>
          
          {/* Language Switcher */}
          <li className="relative language-switcher">
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group"
            >
              <span className="text-lg">{currentLanguage.flag}</span>
              <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${languageOpen ? "rotate-180" : ""}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Language Dropdown */}
            {languageOpen && (
              <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                <div className="p-3 bg-gradient-to-r from-sky-400 to-blue-500">
                  <p className="text-white text-sm font-medium">Select Language</p>
                </div>
                <div className="py-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => switchLanguage(language.code)}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                        currentLocale === language.code ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{language.flag}</span>
                        <div className="text-left">
                          <div className="font-medium text-gray-800">{language.name}</div>
                          <div className="text-xs text-gray-500">{language.nativeName}</div>
                        </div>
                      </div>
                      {currentLocale === language.code && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Mobile Language Switcher */}
          <div className="relative language-switcher">
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="flex items-center gap-1 px-3 py-2 bg-white/20 rounded-lg"
            >
              <span>{currentLanguage.flag}</span>
              <span className="text-sm">{currentLanguage.code.toUpperCase()}</span>
            </button>
            
            {languageOpen && (
              <div className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg shadow-xl border">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => switchLanguage(language.code)}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="cursor-pointer p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <span className="text-2xl">✖</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-xl rounded-b-2xl mx-4 mt-2 animate-slideDown">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Navigation</h3>
              <ul className="space-y-4">
                <li>
                  <Link 
                    href={`/${currentLocale}`} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                      <span className="text-sky-600">🏠</span>
                    </div>
                    <span className="font-medium">Home</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${currentLocale}/dashboard`} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                      <span className="text-sky-600">📊</span>
                    </div>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${currentLocale}/contact`} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                      <span className="text-sky-600">📞</span>
                    </div>
                    <span className="font-medium">Contact</span>
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Languages</h3>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => {
                      switchLanguage(language.code);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                      currentLocale === language.code
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <span className="text-xl">{language.flag}</span>
                    <div className="text-left">
                      <div className="font-medium text-sm">{language.name}</div>
                      <div className="text-xs text-gray-500">{language.code.toUpperCase()}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}