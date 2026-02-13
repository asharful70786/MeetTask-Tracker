import mongoose from "mongoose";

const ActionItemSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 500,
    },
    owner: {
      type: String,
      default: null,
      trim: true,
      maxlength: 120,
    },
    dueDate: {
      // keep as string "YYYY-MM-DD" because LLM returns that cleanly
      type: String,
      default: null,
      match: /^\d{4}-\d{2}-\d{2}$/, // only ISO date
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true, // IMPORTANT: each action item has its own _id for edit/delete
    timestamps: true, // optional: useful if you want per-item createdAt/updatedAt
  }
);

const TranscriptSchema = new mongoose.Schema(
  {
    rawText: {
      type: String,
      required: true,
      trim: true,
    },

    // embedded array of items
    actionItems: {
      type: [ActionItemSchema],
      default: [],
    },
  },
  {
    timestamps: true, // gives createdAt/updatedAt for sorting recent transcripts
  }
);

// for "recent transcripts" fast query
TranscriptSchema.index({ createdAt: -1 });

export default mongoose.model("Transcript", TranscriptSchema);
