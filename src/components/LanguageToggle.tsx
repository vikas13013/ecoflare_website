import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const languages = ["English", "Français"];

  const changeLanguage = (languageName) => {
    const languageMap = {
      "English": "en",
      "Français": "fr"
    };
    i18n.changeLanguage(languageMap[languageName]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLanguage = i18n.language === "fr" ? "Français" : "English";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-colors duration-200 text-black"
        aria-label="Change language"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-black hover:text-black">
          {currentLanguage}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute -right-10 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language}
                onClick={() => changeLanguage(language)}
                className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left ${
                  currentLanguage === language
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="option"
                aria-selected={currentLanguage === language}
              >
                <span>{language}</span>
                {currentLanguage === language && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}