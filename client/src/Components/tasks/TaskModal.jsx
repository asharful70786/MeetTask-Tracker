import React, { useEffect, useState } from "react";

export default function TaskModal({ open, mode, initialValues, onClose, onSubmit }) {
  const [task, setTask] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (!open) return;
    setTask(initialValues?.task || "");
    setOwner(initialValues?.owner || "");
    setDueDate(initialValues?.dueDate || "");
  }, [open, initialValues]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const t = task.trim();
    if (!t) return;

    onSubmit({
      task: t,
      owner: owner.trim() || "",
      dueDate: dueDate || "",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-950 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">{mode === "edit" ? "Edit task" : "Add task"}</h3>
          <button onClick={onClose} className="rounded-lg bg-white/10 px-2 py-1 text-xs text-slate-200 hover:bg-white/15">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-400">Task</label>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-white/20"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Owner (optional)</label>
              <input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-white/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400">Due date (optional)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-xl bg-white/10 px-4 py-2 text-sm text-slate-200 hover:bg-white/15">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!task.trim()}
              className={task.trim() ? "rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200" : "rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-slate-500 cursor-not-allowed"}
            >
              {mode === "edit" ? "Save" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
