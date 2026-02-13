// routes/status.js
import express from "express";
import mongoose from "mongoose";
import { llmHealthCheck } from "../Services/llmHealthCheck.js";


const router = express.Router();

async function mongoHealth() {
  const start = Date.now();

  // must be connected
  if (mongoose.connection.readyState !== 1) {
    return { ok: false, ms: Date.now() - start, error: "mongoose not connected" };
  }

  await mongoose.connection.db.admin().ping();
  return { ok: true, ms: Date.now() - start };
}

router.get("/status", async (req, res) => {
  const ts = new Date().toISOString();

  const result = {
    ok: true,
    ts,
    service: "meet-task-tracker",
    backend: { ok: true },
    mongodb: { ok: false },
    llm: { ok: false },
  };

  // Run checks in parallel
  const [mongo, llm] = await Promise.allSettled([mongoHealth(), llmHealthCheck()]);

  if (mongo.status === "fulfilled") result.mongodb = mongo.value;
  else result.mongodb = { ok: false, error: mongo.reason?.message || "mongo check failed" };

  if (llm.status === "fulfilled") result.llm = llm.value;
  else result.llm = { ok: false, error: llm.reason?.message || "llm check failed" };

  // overall ok only if both deps ok
  result.ok = !!(result.mongodb.ok && result.llm.ok);

  return res.status(result.ok ? 200 : 503).json(result);
});

export default router;
