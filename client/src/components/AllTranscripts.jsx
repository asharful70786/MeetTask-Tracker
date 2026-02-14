import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const API_BASE = (import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
const LIST_URL = `${API_BASE}/transcript/recent?limit=50`;
const FALLBACK_URL = `${API_BASE}/transcript/recent`;

function niceDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AllTranscripts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      let res = await fetch(LIST_URL);
      let data = await res.json().catch(() => null);

      if (!res.ok) {
        res = await fetch(FALLBACK_URL);
        data = await res.json().catch(() => null);
      }

      if (!res.ok) throw new Error(data?.message || "Failed to load transcripts");

      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      setErr(e?.message || "Failed to load");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#0A4739" }}>
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Transcripts</h1>
            <p className="text-white/70 mt-1">Click any transcript to open details.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white px-4 py-2 text-sm font-medium transition"
            >
              Refresh
            </button>

            <Link
              to="/"
              className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white px-4 py-2 text-sm font-medium transition"
            >
              Back
            </Link>
          </div>
        </div>

        {/* Outer card stays glassy on green */}
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="text-white/80 text-sm">
              {loading ? "Loading…" : `${items.length} transcript(s)`}
            </div>
          
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-white/80">Fetching transcripts…</div>
            ) : err ? (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4">
                <div className="text-rose-100 font-semibold">Couldn’t load transcripts</div>
                <div className="text-rose-100/80 text-sm mt-1">{err}</div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-white/70">No transcripts found yet.</div>
            ) : (
              // ✅ Single column list
              <div className="space-y-4">
                {items.map((t, idx) => (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, delay: idx * 0.03 }}
                  >
                    <Link
                      to={`/transcripts/${t._id}`}
                      className="
                        block rounded-2xl bg-white
                        border border-black/5
                        shadow-sm hover:shadow-md
                        transition
                      "
                    >
                      <div className="p-5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-slate-900 font-semibold">
                            Transcript
                          </div>
                          <div className="text-slate-700 text-sm mt-1 break-all">
                            {t._id}
                          </div>
                          <div className="text-slate-500 text-xs mt-2">
                            Created: {niceDate(t.createdAt)}
                          </div>
                        </div>

                        <motion.span
                          className="text-slate-400 text-lg"
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
