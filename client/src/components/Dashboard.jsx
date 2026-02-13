import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCopy, 
  FiCheck, 
  FiClock, 
  FiUsers, 
  FiCalendar, 
  FiFileText,
  FiArrowRight,
  FiStar,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiZap,
  FiShield,
  FiTrendingUp
} from "react-icons/fi";
import SystemHealthDots from "./SystemHealthDots";

const API_BASE = (import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
const EXTRACT_URL = `${API_BASE}/transcript/extract`;

const PROCESS_STEPS = [
  { title: "Ingesting transcript", desc: "Cleaning formatting and detecting speakers…", icon: FiFileText },
  { title: "Understanding context", desc: "Finding decisions, blockers, and responsibilities…", icon: FiUsers },
  { title: "Extracting action items", desc: "Converting discussion into tasks…", icon: FiStar },
  { title: "Assigning owners", desc: "Inferring owners where possible…", icon: FiUsers },
  { title: "Detecting due dates", desc: "Parsing explicit and implied deadlines…", icon: FiCalendar },
  { title: "Structuring output", desc: "Normalizing into clean JSON…", icon: FiClock },
];

const FEATURES = [
  {
    icon: FiZap,
    title: "Instant Extraction",
    desc: "Get action items in seconds with our AI-powered parser"
  },
  {
    icon: FiUsers,
    title: "Smart Owner Detection",
    desc: "Automatically identifies who's responsible for each task"
  },
  {
    icon: FiCalendar,
    title: "Due Date Recognition",
    desc: "Extracts deadlines from natural language"
  },
  {
    icon: FiShield,
    title: "Enterprise Ready",
    desc: "Secure, scalable, and production-tested"
  }
];

const STATS = [
  { value: "99.9%", label: "Accuracy Rate" },
  { value: "<2s", label: "Processing Time" },
  { value: "50K+", label: "Meetings Processed" },
  { value: "4.9/5", label: "User Rating" }
];

function safeJsonParse(txt) {
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

function pretty(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}

export default function Dashboard({ onExtractSuccess, initialTranscript = "" }) {
  const [transcript, setTranscript] = useState(initialTranscript);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    setTranscript(initialTranscript || "");
  }, [initialTranscript]);

  const canSubmit = useMemo(() => transcript.trim().length >= 40 && !isSubmitting, [transcript, isSubmitting]);

  useEffect(() => {
    if (!isSubmitting) return;

    setActiveStep(0);
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev < PROCESS_STEPS.length - 1 ? prev + 1 : prev));
    }, 900);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isSubmitting]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setResult(null);

    const text = transcript.trim();
    if (text.length < 40) {
      setErr("Please paste a valid transcript (minimum 40 characters).");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(EXTRACT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: text }),
      });

      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : safeJsonParse(await res.text());

      if (!res.ok) {
        const msg =
          typeof data === "string"
            ? data
            : data?.message || data?.error || `Request failed (${res.status})`;
        throw new Error(msg);
      }

      setResult(data);
      onExtractSuccess?.(data);
    } catch (e2) {
      setErr(e2?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  function fillSample() {
    setTranscript(
      `Ashraful: We need a Meeting Action Items Tracker MVP for our Q4 launch.
Sehnaz: Extract action items with owner and due date if present. The marketing team needs this by Friday.
Dev: I'll build backend endpoint /api/extract and save transcript + items to MongoDB. Should be done by tomorrow.
Ashraful: Frontend should let user paste transcript and show results on the right. Make it intuitive.
Sehnaz: Make it feel like it's processing, step-by-step. The design should be modern and professional.`
    );
  }

  function clearAll() {
    setTranscript("");
    setErr("");
    setResult(null);
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(pretty(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#064E3B] via-[#0F172A] to-[#000000] text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F97316]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-[#F59E0B]/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-[#F97316]/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2 mb-6 border border-white/20">
              <span className="w-2 h-2 bg-[#F97316] rounded-full animate-pulse" />
              <span className="text-sm font-medium">✨ AI-Powered Meeting Intelligence</span>
            </div>
            
            <SystemHealthDots intervalMs={30000} />

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Meetings into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#F59E0B]">
                Actionable Insights
              </span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Paste your transcript, get instant action items with owners and due dates. 
              No more manual tracking. No more missed deadlines.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {STATS.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                >
                  <div className="text-2xl font-bold text-[#F97316]">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mt-12">
          {/* Left: transcript input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Meeting Transcript</h2>
                  <p className="text-sm text-gray-500 mt-1">Paste your meeting transcript below</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={fillSample}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all hover:scale-105"
                  >
                    Sample
                  </button>
                  <button
                    onClick={clearAll}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all hover:scale-105"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="relative">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Paste your meeting transcript here... (e.g., 'John: We need to launch by Friday. Sarah: I'll handle the design.')"
                  className="w-full h-64 p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] resize-none"
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded-lg">
                  {transcript.trim().length} chars
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-gray-500">
                  💡 Include speaker names for better owner detection
                </p>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`
                    px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
                    ${canSubmit 
                      ? 'bg-gradient-to-r from-[#F97316] to-[#F59E0B] text-white hover:scale-105 hover:shadow-lg' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Extract Action Items
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {err && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <p className="text-sm text-red-600">{err}</p>
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Right: processing + result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Extraction Results</h2>
                  <p className="text-sm text-gray-500 mt-1">Your action items will appear here</p>
                </div>
                {result && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    {copied ? (
                      <>
                        <FiCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Copied!</span>
                      </>
                    ) : (
                      <>
                        <FiCopy className="w-4 h-4" />
                        <span className="text-sm">Copy JSON</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#F97316] to-[#F59E0B] rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
                        <FiZap className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {PROCESS_STEPS[activeStep]?.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {PROCESS_STEPS[activeStep]?.desc}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {PROCESS_STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isActive = idx === activeStep;
                        const isComplete = idx < activeStep;
                        
                        return (
                          <motion.div
                            key={step.title}
                            className={`
                              flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                              ${isActive ? 'border-[#F97316] bg-[#F97316]/5' : 
                                isComplete ? 'border-green-500 bg-green-50' : 
                                'border-gray-200 bg-gray-50'}
                            `}
                            animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                          >
                            <div className={`
                              w-8 h-8 rounded-lg flex items-center justify-center
                              ${isActive ? 'bg-[#F97316] text-white' : 
                                isComplete ? 'bg-green-500 text-white' : 
                                'bg-gray-200 text-gray-500'}
                            `}>
                              {isComplete ? (
                                <FiCheck className="w-4 h-4" />
                              ) : (
                                <StepIcon className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`
                                text-sm font-medium
                                ${isActive ? 'text-[#F97316]' : 
                                  isComplete ? 'text-green-700' : 
                                  'text-gray-700'}
                              `}>
                                {step.title}
                              </p>
                              <p className="text-xs text-gray-500">{step.desc}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#F97316] to-[#F59E0B]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${((activeStep + 1) / PROCESS_STEPS.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-xl border border-gray-200">
                      {pretty(result)}
                    </pre>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                      <FiFileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results yet</h3>
                    <p className="text-sm text-gray-500 max-w-sm">
                      Paste a transcript on the left and click "Extract Action Items" to see the magic happen.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#F97316] to-[#F59E0B] rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>

       

      </div>
    </div>
  );
}