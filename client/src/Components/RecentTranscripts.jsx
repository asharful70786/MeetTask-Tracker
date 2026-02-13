import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCalendar, FiFileText, FiAlertCircle } from "react-icons/fi";

const API_BASE = (import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
const RECENT_URL = `${API_BASE}/transcript/recent?limit=5`;

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays === 0) {
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    return `Today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  if (diffDays === 1) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  if (diffDays < 7) {
    return `${date.toLocaleDateString([], { weekday: "long" })} at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTimeColor(dateString) {
  if (!dateString) return "text-white/55";

  const date = new Date(dateString);
  const now = new Date();
  const diffHours = Math.floor((now - date) / 3600000);

  if (diffHours < 1) return "text-emerald-300";
  if (diffHours < 24) return "text-amber-300"; // keep warm accent like your hero
  return "text-white/55";
}

export default function RecentTranscripts() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(RECENT_URL);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load recent transcripts");
        if (alive) setItems(Array.isArray(data) ? data : data?.items || []);
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const openTranscript = (t) => {
    if (!t?._id) return;
    navigate(`/transcripts/${t._id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0 },
    hover: {
      scale: 1.015,
      backgroundColor: "rgba(13,66,56,0.55)", // #0D4238 with opacity
      transition: { type: "spring", stiffness: 420, damping: 22 },
    },
    tap: { scale: 0.985 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="
        rounded-2xl
        border border-emerald-300/10
        bg-gradient-to-b from-[#0D4238]/55 via-[#0F172A]/45 to-black/35
        p-5
        backdrop-blur-xl
        shadow-[0_30px_80px_-45px_rgba(0,0,0,0.85)]
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="
              w-9 h-9 rounded-xl
              bg-gradient-to-br from-emerald-400/25 via-emerald-300/15 to-cyan-400/10
              border border-emerald-300/15
              flex items-center justify-center
            "
          >
            <FiClock className="w-4 h-4 text-emerald-200" />
          </div>
          <h3 className="text-sm font-semibold text-white">Recent transcripts</h3>
        </div>

        <motion.div
          whileHover={{ scale: 1.04 }}
          className="
            px-2.5 py-1 rounded-lg
            text-xs text-white/70
            bg-white/5 border border-white/10
          "
        >
          Last 5
        </motion.div>
      </div>

      <div className="mt-3">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="h-16 rounded-xl bg-[#0D4238]/35 border border-emerald-300/10 overflow-hidden relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.35,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.12,
                    }}
                  />
                  <div className="p-3 space-y-2">
                    <div className="h-3 w-2/3 rounded bg-white/12" />
                    <div className="h-2 w-1/2 rounded bg-white/8" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : err ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-rose-500/25 bg-rose-500/10 p-4"
            >
              <div className="flex items-start gap-3">
                <FiAlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-rose-100">Failed to load</p>
                  <p className="text-xs text-rose-200/80 mt-1">{err}</p>
                </div>
              </div>
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-emerald-300/10 bg-[#0D4238]/25 p-8 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.07, 1.07, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="
                  w-12 h-12 mx-auto mb-3 rounded-2xl
                  bg-gradient-to-br from-emerald-400/20 via-emerald-300/12 to-cyan-400/10
                  border border-emerald-300/15
                  flex items-center justify-center
                "
              >
                <FiFileText className="w-6 h-6 text-emerald-200/85" />
              </motion.div>

              <p className="text-sm text-white/80">No history yet</p>
              <p className="text-xs text-white/55 mt-1">Extract your first transcript to see it here</p>
            </motion.div>
          ) : (
            <motion.div
              key="items"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {items.map((t) => {
                const formattedDate = formatDate(t.createdAt);
                const timeColor = getTimeColor(t.createdAt);

                return (
                  <motion.button
                    key={t._id}
                    variants={itemVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onHoverStart={() => setHoveredId(t._id)}
                    onHoverEnd={() => setHoveredId(null)}
                    onClick={() => openTranscript(t)}
                    className="
                      w-full rounded-xl
                      border border-emerald-300/10
                      bg-[#0D4238]/25
                      p-3.5 text-left
                      group relative overflow-hidden
                    "
                  >
                    {/* hover sweep */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-300/10 to-amber-300/0"
                      initial={{ x: "-110%" }}
                      animate={{ x: hoveredId === t._id ? "110%" : "-110%" }}
                      transition={{ duration: 0.6 }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <motion.div
                            className="flex items-center gap-2"
                            animate={{ x: hoveredId === t._id ? 2 : 0 }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-300/90" />
                            <p className="text-sm font-medium text-white truncate">
                              {t.title || "Untitled meeting"}
                            </p>
                          </motion.div>
                        </div>

                        <motion.div
                          className={`
                            flex items-center gap-1.5 px-2 py-1 rounded-lg
                            text-[10px] font-medium
                            ${timeColor}
                            bg-white/5 border border-white/10
                          `}
                          animate={{
                            scale: hoveredId === t._id ? 1.04 : 1,
                            backgroundColor:
                              hoveredId === t._id ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.05)",
                          }}
                        >
                          <FiCalendar className="w-3 h-3" />
                          <span>{formattedDate}</span>
                        </motion.div>
                      </div>

                      {t.preview && (
                        <motion.p
                          className="text-xs text-white/55 line-clamp-2 leading-relaxed"
                          animate={{ opacity: hoveredId === t._id ? 0.92 : 0.68 }}
                        >
                          {t.preview}
                        </motion.p>
                      )}

                      <motion.div
                        className="flex items-center gap-3 mt-2 text-[10px] text-white/45"
                        animate={{ opacity: hoveredId === t._id ? 1 : 0.78 }}
                      >
                        <span className="flex items-center gap-1">
                          <FiClock className="w-3 h-3" />
                          {new Date(t.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>

                        {t.wordCount && (
                          <>
                            <span>•</span>
                            <span>{t.wordCount} words</span>
                          </>
                        )}
                      </motion.div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* View all */}
      {items.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          whileHover={{ x: 4 }}
          onClick={() => navigate("/transcripts")}
          className="
            mt-4 w-full
            text-xs text-white/55 hover:text-amber-300
            transition-colors
            flex items-center justify-center gap-1
            py-2 border-t border-white/10
          "
        >
          <span>View all transcripts</span>
          <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            →
          </motion.span>
        </motion.button>
      )}
    </motion.div>
  );
}
