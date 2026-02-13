import React from "react";
import { FiGithub, FiLinkedin, FiTwitter, FiZap } from "react-icons/fi";

function Footer() {
  return (
    <footer className="
      
      border-t border-emerald-200/10
      bg-gradient-to-b from-[#0F172A] via-[#0D4238]/40 to-black
      backdrop-blur-xl
    ">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <div
              className="
                w-8 h-8 rounded-xl
                bg-gradient-to-br from-emerald-400/25 via-emerald-300/15 to-cyan-400/10
                border border-emerald-300/15
                flex items-center justify-center
              "
            >
              <FiZap className="w-4 h-4 text-emerald-200" />
            </div>

            <span className="text-sm text-white/60 tracking-wide">
              © 2024 MeetTask. All rights reserved.
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <FiGithub className="w-5 h-5 text-white/40 hover:text-emerald-300 transition-colors cursor-pointer" />
            <FiTwitter className="w-5 h-5 text-white/40 hover:text-emerald-300 transition-colors cursor-pointer" />
            <FiLinkedin className="w-5 h-5 text-white/40 hover:text-emerald-300 transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
