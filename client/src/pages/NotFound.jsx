import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiHome, FiSearch, FiAlertTriangle } from "react-icons/fi";

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064E3B] via-[#0F172A] to-[#000000] text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="
          w-full max-w-2xl
          rounded-3xl
          border border-emerald-200/10
          bg-gradient-to-b from-[#0D4238]/40 via-[#0F172A]/55 to-black/40
          backdrop-blur-xl
          shadow-[0_35px_90px_-55px_rgba(0,0,0,0.9)]
          p-8 md:p-10
          relative overflow-hidden
        "
      >
        {/* subtle glow */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-300/8 blur-3xl" />

        <div className="relative">
          {/* icon */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0D4238]/45 border border-emerald-200/15 flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="text-sm text-white/60">
              Error 404 • Page not found
            </div>
          </div>

          {/* headline */}
          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
            This page doesn’t exist.
          </h1>

          <p className="mt-3 text-white/65 leading-relaxed">
            The route you tried to open is not available:
            <span className="ml-2 inline-flex items-center rounded-lg border border-emerald-200/10 bg-white/5 px-2 py-1 text-xs text-white/70">
              {location.pathname}
            </span>
          </p>

          {/* actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl px-4 py-2.5
                bg-emerald-400/15 border border-emerald-200/15
                text-white/90
                hover:bg-emerald-400/20 hover:border-emerald-200/25
                transition
              "
            >
              <FiHome className="w-4 h-4 text-emerald-300" />
              Go home
            </Link>

            <Link
              to="/transcripts"
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl px-4 py-2.5
                bg-white/5 border border-white/10
                text-white/80
                hover:bg-white/8 hover:border-white/15
                transition
              "
            >
              <FiSearch className="w-4 h-4 text-white/70" />
              View transcripts
            </Link>

            <button
              onClick={() => window.history.back()}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl px-4 py-2.5
                bg-white/5 border border-white/10
                text-white/80
                hover:bg-white/8 hover:border-white/15
                transition
              "
            >
              <FiArrowLeft className="w-4 h-4 text-white/70" />
              Go back
            </button>
          </div>

          {/* tiny helper */}
          <p className="mt-6 text-xs text-white/45">
            If you think this is a bug, the route should be added in React Router.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
