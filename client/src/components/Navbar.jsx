import React from "react";
import { FiZap } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { label: "Home", path: "/" },
  { label: "Healthcheck", path: "/status" },
  { label: "Transcripts", path: "/transcripts" },
];

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-[#0A4B3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#F97316] to-[#F59E0B] rounded-xl flex items-center justify-center shadow-md">
              <FiZap className="w-4 h-4 text-white" />
            </div>

            <span className="font-semibold text-lg text-white">MeetTask</span>

            <span className="px-2 py-1 bg-white/10 rounded-lg text-xs font-medium text-white/80">
              Beta
            </span>
          </div>

          {/* Right: Nav */}
          <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-xl border border-white/10">
            <div className="relative flex items-center gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {/* Sliding active pill */}
                  <AnimatePresence>
                    {isActive(item.path) && (
                      <motion.span
                        layoutId="activePill"
                        className="absolute inset-0 rounded-lg bg-white/12 border border-white/10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                  </AnimatePresence>

                  <span className="relative z-10">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-white/10 mx-2" />

            {/* Button: subtle hover smoothness */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="bg-white text-[#064E3B] px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/90"
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
