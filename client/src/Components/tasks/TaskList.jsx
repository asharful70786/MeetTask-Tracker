import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaEdit,
  FaTrashAlt,
  FaUser,
  FaCalendarAlt,
  FaSpinner,
} from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";

const cn = (...xs) => xs.filter(Boolean).join(" ");

function niceDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

const V = {
  container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } },
  item: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
    exit: { opacity: 0, scale: 0.8, y: -20, transition: { duration: 0.2 } },
  },
  empty: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
  },
};

function Chip({ icon: Icon, text, busy, className }) {
  return (
    <motion.div
      whileHover={!busy ? { scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" } : undefined}
      className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs", className)}
    >
      <Icon className={cn("h-3 w-3", busy ? "text-indigo-300" : "text-indigo-400")} />
      <span>{text}</span>
    </motion.div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, disabled, className }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </motion.button>
  );
}

export default function TaskList({ items, busyId, onToggleDone, onEdit, onDelete }) {
  if (!items?.length) {
    return (
      <motion.div
        variants={V.empty}
        initial="hidden"
        animate="visible"
        className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-12 text-center backdrop-blur-sm"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1.1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          className="mb-4"
        >
          <MdOutlineTaskAlt className="mx-auto text-5xl text-indigo-400/50" />
        </motion.div>
        <p className="bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-lg font-medium text-transparent">
          No tasks found
        </p>
        <p className="mt-2 text-sm text-slate-500">Create your first task to get started</p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={V.container} initial="hidden" animate="visible" className="space-y-3">
      <AnimatePresence mode="popLayout">
        {items.map((t) => {
          const busy = busyId === t._id;

          return (
            <motion.div
              key={t._id}
              variants={V.item}
              exit="exit"
              layout
              whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 to-white/10 p-4 backdrop-blur-sm transition-colors hover:border-indigo-500/30 hover:from-indigo-500/10 hover:to-purple-500/10"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-purple-500/0"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "linear" }}
              />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <motion.button
                    onClick={() => onToggleDone(t)}
                    disabled={busy}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={t.done ? "Mark open" : "Mark done"}
                    className={cn(
                      "relative mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all",
                      t.done ? "border-indigo-500 bg-indigo-500" : "border-white/30 bg-white/5 hover:border-indigo-400/50",
                      busy ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {t.done && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        >
                          <FaCheck className="h-3 w-3 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <div className="space-y-2">
                    <motion.div
                      animate={{ opacity: t.done ? 0.7 : 1 }}
                      className={cn(
                        "text-sm font-medium",
                        t.done ? "text-slate-500 line-through" : "text-slate-100"
                      )}
                    >
                      {t.task}
                    </motion.div>

                    <div className="flex flex-wrap gap-2">
                      <Chip icon={FaUser} text={t.owner || "Unassigned"} className="bg-white/10 text-slate-300" />
                      <Chip icon={FaCalendarAlt} text={niceDate(t.dueDate)} className="bg-white/10 text-slate-300" />
                      {busy && (
                        <Chip
                          icon={FaSpinner}
                          text="Updating..."
                          busy
                          className="bg-indigo-500/20 text-indigo-300"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <ActionBtn
                    icon={FaEdit}
                    label="Edit"
                    disabled={busy}
                    onClick={() => onEdit(t)}
                    className="bg-white/10 text-slate-100 hover:bg-white/20"
                  />
                  <ActionBtn
                    icon={FaTrashAlt}
                    label="Delete"
                    disabled={busy}
                    onClick={() => onDelete(t)}
                    className="bg-red-500/20 text-red-200 hover:bg-red-500/30"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}



