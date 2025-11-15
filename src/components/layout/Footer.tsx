"use client";

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

interface FooterProps {
  onCategoryClick?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onCategoryClick }) => {
  const currentYear = new Date().getFullYear();

  const sections = [
    "Politics",
    "Technology",
    "Business",
    "Sports",
    "Culture",
    "Science",
    "World",
    "Opinion",
  ];

  const handleSectionClick = (sectionName: string) => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Call the category filter function if provided
    if (onCategoryClick) {
      onCategoryClick(sectionName);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info with Logo */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img
                src="/logo-dark.svg"
                alt="AM News"
                className="h-10 w-auto mb-4"
              />
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Delivering quality journalism and in-depth analysis on the stories
              that matter most.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Sections - Functional Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Sections
            </h4>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section}>
                  <button
                    onClick={() => handleSectionClick(section)}
                    className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm block w-full text-left"
                  >
                    {section}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - Non-functional */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm cursor-not-allowed opacity-60"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm cursor-not-allowed opacity-60"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm cursor-not-allowed opacity-60"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm cursor-not-allowed opacity-60"
                >
                  Advertise
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm cursor-not-allowed opacity-60"
                >
                  Newsletter
                </a>
              </li>
            </ul>
          </div>

          {/* Legal - Non-functional */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm cursor-not-allowed opacity-60"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm cursor-not-allowed opacity-60"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm cursor-not-allowed opacity-60"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm cursor-not-allowed opacity-60"
                >
                  Ethics Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-gray-400 hover:text-[#007BFF] transition-colors text-sm cursor-not-allowed opacity-60"
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © {currentYear} AM News. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs text-center sm:text-right">
              Built with passion for quality journalism
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
