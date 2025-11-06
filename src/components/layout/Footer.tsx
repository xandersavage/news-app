"use client";

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white mb-4 font-serif">The Chronicle</h3>
            <p className="text-gray-400 mb-4">
              Delivering quality journalism and in-depth analysis on the stories
              that matter most.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-4">Sections</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Politics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Business
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Sports
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Culture
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Advertise
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Newsletter
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Ethics Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#007BFF] transition-colors">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {currentYear} The Chronicle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
