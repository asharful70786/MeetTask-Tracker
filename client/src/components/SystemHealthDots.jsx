import React, { useEffect, useState } from "react";


const API_BASE = (import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
const STATUS_URL = `${API_BASE}/status`;

function dotClass(ok) {
  return ok ? "bg-green-400" : "bg-red-500";
}

export default function SystemHealthDots({ intervalMs = 30000 }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        const res = await fetch(STATUS_URL);
        const data = await res.json();
        if (alive) setStatus(data);
      } catch {
        if (alive) setStatus({ backend: { ok: false }, mongodb: { ok: false }, llm: { ok: false } });
      }
    }

    load();
    const t = setInterval(load, intervalMs);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [intervalMs]);

  const backendOk = !!status?.backend?.ok;
  const mongoOk = !!status?.mongodb?.ok;
  const llmOk = !!status?.llm?.ok;

  return (
    <div className="mt-3 flex items-center justify-center gap-2">
      <span
        title={backendOk ? "Backend: OK" : "Backend: DOWN"}
        className={`w-2.5 h-2.5 rounded-full ${dotClass(backendOk)}`}
      />
      <span
        title={mongoOk ? `DB: OK (${status?.mongodb?.ms ?? "-"}ms)` : `DB: DOWN`}
        className={`w-2.5 h-2.5 rounded-full ${dotClass(mongoOk)}`}
      />
      <span
        title={llmOk ? `LLM: OK (${status?.llm?.ms ?? "-"}ms)` : `LLM: DOWN`}
        className={`w-2.5 h-2.5 rounded-full ${dotClass(llmOk)}`}
      />
    </div>
  );
}
