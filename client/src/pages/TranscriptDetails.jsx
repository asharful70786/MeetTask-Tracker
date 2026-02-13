import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import TaskModal from "../components/Tasks/TaskModal.jsx";



const API_BASE = (import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");

const endpoints = {
  getTranscript: (id) => `${API_BASE}/transcript/${id}`,
  editTask: () => `${API_BASE}/transcript/edit`,
  addTask: () => `${API_BASE}/transcript/add-task`,
  deleteTask: () => `${API_BASE}/transcript/delete`,
};

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function toDateInput(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function TranscriptDetails() {
  const { id } = useParams();

  const [transcript, setTranscript] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [query, setQuery] = useState("");
  const [dueFrom, setDueFrom] = useState("");
  const [dueTo, setDueTo] = useState("");
  const [status, setStatus] = useState("open");

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [activeItem, setActiveItem] = useState(null);

  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(endpoints.getTranscript(id));
        const json = await safeJson(res);
        if (!res.ok) throw new Error(json?.message || "Failed to load transcript");
        if (!alive) return;
        setTranscript(json);
        setItems(Array.isArray(json?.actionItems) ? json.actionItems : []);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    if (id) load();
    return () => {
      alive = false;
    };
  }, [id]);

  const stats = useMemo(() => {
    const total = items.length;
    const done = items.filter((x) => x.done).length;
    return { total, done, open: total - done };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return items
      .filter((t) => {
        if (status === "open" && t.done) return false;
        if (status === "done" && !t.done) return false;
        return true;
      })
      .filter((t) => {
        if (!q) return true;
        const hay = `${t.task || ""} ${t.owner || ""}`.toLowerCase();
        return hay.includes(q);
      })
      .filter((t) => {
        if (!dueFrom && !dueTo) return true;
        if (!t.dueDate) return false;
        const d = new Date(t.dueDate).getTime();
        const from = dueFrom ? new Date(dueFrom).getTime() : -Infinity;
        const to = dueTo ? new Date(dueTo).getTime() : Infinity;
        return d >= from && d <= to;
      })
      .sort((a, b) => {
        if (!!a.done !== !!b.done) return a.done ? 1 : -1;
        const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return ad - bd;
      });
  }, [items, query, dueFrom, dueTo, status]);

  function openAdd() {
    setMode("add");
    setActiveItem(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setMode("edit");
    setActiveItem(item);
    setModalOpen(true);
  }

  async function refreshFromServer(nextTranscript) {
    if (nextTranscript?.actionItems) {
      setTranscript(nextTranscript);
      setItems(Array.isArray(nextTranscript.actionItems) ? nextTranscript.actionItems : []);
      return;
    }
    const res = await fetch(endpoints.getTranscript(id));
    const json = await safeJson(res);
    if (res.ok) {
      setTranscript(json);
      setItems(Array.isArray(json?.actionItems) ? json.actionItems : []);
    }
  }

  async function handleToggleDone(item) {
    setBusyId(item._id);
    setErr("");
    try {
      const res = await fetch(endpoints.editTask(), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptId: id, actionItemId: item._id, done: !item.done }),
      });
      const json = await safeJson(res);
      if (!res.ok) throw new Error(json?.message || "Failed to update task");
      await refreshFromServer(json);
    } catch (e) {
      setErr(e?.message || "Failed to update");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(item) {
    const ok = window.confirm("Delete this task? This cannot be undone.");
    if (!ok) return;

    setBusyId(item._id);
    setErr("");
    try {
      const res = await fetch(endpoints.deleteTask(), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcriptId: id, actionItemId: item._id }),
      });
      const json = await safeJson(res);
      if (!res.ok) throw new Error(json?.message || "Failed to delete task");
      await refreshFromServer(json);
    } catch (e) {
      setErr(e?.message || "Failed to delete");
    } finally {
      setBusyId(null);
    }
  }

  async function handleModalSubmit(values) {
    setErr("");

    if (mode === "add") {
      try {
        const res = await fetch(endpoints.addTask(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcriptId: id,
            task: values.task,
            owner: values.owner || null,
            dueDate: values.dueDate || null,
          }),
        });
        const json = await safeJson(res);
        if (!res.ok) throw new Error(json?.message || "Failed to add task");
        await refreshFromServer(json);
        setModalOpen(false);
      } catch (e) {
        setErr(e?.message || "Failed to add");
      }
      return;
    }

    if (mode === "edit" && activeItem?._id) {
      setBusyId(activeItem._id);
      try {
        const res = await fetch(endpoints.editTask(), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcriptId: id,
            actionItemId: activeItem._id,
            task: values.task,
            owner: values.owner || null,
            dueDate: values.dueDate || null,
          }),
        });
        const json = await safeJson(res);
        if (!res.ok) throw new Error(json?.message || "Failed to edit task");
        await refreshFromServer(json);
        setModalOpen(false);
      } catch (e) {
        setErr(e?.message || "Failed to edit");
      } finally {
        setBusyId(null);
      }
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 blur-xl bg-orange-200/50 rounded-full"></div>
          <p className="mt-4 text-orange-600 font-medium">Loading your tasks...</p>
        </div>
      </div>
    );

  if (err)
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6">
            <div className="flex items-center gap-3 text-red-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">{err}</span>
            </div>
          </div>
        </div>
      </div>
    );

  if (!transcript)
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Transcript Not Found</h2>
            <p className="text-orange-600">The meeting transcript you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-slate-900 to-black">
      <div className="p-4 md:p-6">
        <div className="mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 mb-6 overflow-hidden">
            <div className="p-5 md:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{transcript?.title || "Untitled meeting"}</h1>
                  <div className="flex items-center gap-2 mt-1 text-sm text-orange-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {transcript?.createdAt
                        ? new Date(transcript.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex gap-2">
                    <div className="px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
                      <span className="text-sm text-gray-600">Total</span>
                      <span className="ml-2 font-bold text-orange-600">{stats.total}</span>
                    </div>
                    <div className="px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-sm text-gray-600">Open</span>
                      <span className="ml-2 font-bold text-emerald-600">{stats.open}</span>
                    </div>
                    <div className="px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                      <span className="text-sm text-gray-600">Done</span>
                      <span className="ml-2 font-bold text-blue-600">{stats.done}</span>
                    </div>
                  </div>

                  <button
                    onClick={openAdd}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Task
                  </button>
                </div>
              </div>

              {/* ✅ divider so Add Task area feels separate from Search/Filters */}
              <div className="h-px bg-orange-100 mb-5" />

              <div className="grid gap-4 md:grid-cols-12">
                <div className="md:col-span-5">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Search</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search tasks or owners..."
                      className="w-full border border-gray-200 bg-gray-50 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200 transition"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">From</label>
                  <input
                    type="date"
                    value={dueFrom}
                    onChange={(e) => setDueFrom(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200 transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">To</label>
                  <input
                    type="date"
                    value={dueTo}
                    onChange={(e) => setDueTo(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200 transition"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Status</label>
                  <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                    {["open", "done", "all"].map((k) => (
                      <button
                        key={k}
                        onClick={() => setStatus(k)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                          status === k ? "bg-white text-orange-600 shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden mb-6">
            {filtered.length === 0 ? (
              <div className="p-8 text-center">
                <div className="inline-block p-3 bg-orange-50 rounded-full mb-3">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">No tasks found</h3>
                <p className="text-gray-500 text-sm">Try adjusting your filters or add a new task</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <div key={item._id} className="p-4 hover:bg-orange-50/30 transition">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleDone(item)}
                        disabled={busyId === item._id}
                        className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 transition ${
                          item.done ? "bg-emerald-500 border-emerald-500" : "border-gray-300 hover:border-orange-400"
                        } ${busyId === item._id ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {item.done && (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <p className={`text-base ${item.done ? "text-gray-400 line-through" : "text-gray-800"}`}>{item.task}</p>
                          {item.owner && (
                            <span className="inline-flex items-center gap-1 text-sm text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full w-fit">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {item.owner}
                            </span>
                          )}
                        </div>

                        {item.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => openEdit(item)}
                          disabled={busyId === item._id}
                          className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50 transition disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          disabled={busyId === item._id}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <details className="group bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <summary className="cursor-pointer list-none p-4 hover:bg-orange-50/30 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium text-gray-700">View Raw Transcript</span>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div className="border-t border-orange-100 bg-gray-50 p-4">
              <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap text-sm text-gray-700 font-mono">{transcript?.rawText || ""}</pre>
            </div>
          </details>
        </div>
      </div>

      <TaskModal
        open={modalOpen}
        mode={mode}
        initialValues={{
          task: mode === "edit" ? activeItem?.task || "" : "",
          owner: mode === "edit" ? activeItem?.owner || "" : "",
          dueDate: mode === "edit" ? toDateInput(activeItem?.dueDate) : "",
        }}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
