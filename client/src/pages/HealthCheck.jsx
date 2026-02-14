import React, { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
const STATUS_URL = `${API_BASE}/status`;

function Badge({ ok }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border",
        ok
          ? "bg-emerald-500/15 text-emerald-200 border-emerald-400/30"
          : "bg-rose-500/15 text-rose-200 border-rose-400/30",
      ].join(" ")}
    >
      <span className={["w-2 h-2 rounded-full", ok ? "bg-emerald-400" : "bg-rose-400"].join(" ")} />
      {ok ? "OK" : "DOWN"}
    </span>
  );
}

function MetricRow({ label, ok, ms, extra }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <div className="text-white font-medium">{label}</div>
        <Badge ok={!!ok} />
        {typeof ms === "number" && (
          <span className="text-xs text-white/70">{ms} ms</span>
        )}
        {extra ? <span className="text-xs text-white/70">{extra}</span> : null}
      </div>
    </div>
  );
}

export default function Healthcheck() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(STATUS_URL);
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.message || `Request failed (${res.status})`);
      }
      setData(json);
    } catch (e) {
      setErr(e?.message || "Failed to load status");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const overallOk = !!data?.ok;

  return (
    <div className="min-h-screen px-4 py-10" style={{ backgroundColor: "#0A4739" }}>
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">System Health</h1>
            <p className="text-white/70 mt-1">
              Live checks from backend, database, and LLM.
            </p>
          </div>

          <button
            onClick={load}
            className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white px-4 py-2 text-sm font-medium transition"
          >
            Refresh
          </button>
        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <div className="text-white/70 text-sm">Service</div>
              <div className="text-white text-xl font-semibold">
                {data?.service || "meet-task-tracker"}
              </div>
              <div className="text-white/60 text-xs mt-1">
                {data?.ts ? new Date(data.ts).toLocaleString() : "—"}
              </div>
            </div>

            {loading ? (
              <span className="text-white/70 text-sm">Checking…</span>
            ) : err ? (
              <span className="text-rose-200 text-sm">Error</span>
            ) : (
              <Badge ok={overallOk} />
            )}
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-white/80">Loading health status…</div>
            ) : err ? (
              <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4">
                <div className="text-rose-100 font-semibold">Status check failed</div>
                <div className="text-rose-100/80 text-sm mt-1">{err}</div>
                <div className="text-white/60 text-xs mt-3">
                  Tried: <span className="text-white/80">{STATUS_URL}</span>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                <MetricRow label="Backend" ok={data?.backend?.ok} />
                <MetricRow label="MongoDB" ok={data?.mongodb?.ok} ms={data?.mongodb?.ms} />
                <MetricRow
                  label="LLM"
                  ok={data?.llm?.ok}
                  ms={data?.llm?.ms}
                  extra={data?.llm?.model ? `Model: ${data.llm.model}` : ""}
                />
              </div>
            )}
          </div>
        </div>

        {/* Optional: raw JSON for debugging */}
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4">
          <div className="text-white/70 text-xs mb-2">Raw response</div>
          <pre className="text-white/80 text-xs overflow-auto">
            {data ? JSON.stringify(data, null, 2) : "{}"}
          </pre>
        </div>
      </div>
    </div>
  );
}
