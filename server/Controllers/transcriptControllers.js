import mongoose from "mongoose";
import Transcript from "../model/Transcript.js";
import format_Items_Ai from "../Services/format_Items_Ai.js";
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getTranscripts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const docs = await Transcript.find({})
      .sort({ createdAt: -1 }).limit(limit).select("_id createdAt");

     return  res.status(200).json(docs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const individual_Transcript = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const doc = await Transcript.findById(id);
    if (!doc) return res.status(404).json({ error: "Transcript not found" });
    return res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const saveTranscript = async(req, res) => {

   const { transcript } = req.body;

   if (!transcript)  return res.status(400).json({ error: "Transcript is required" });

 
   const actionItems = await format_Items_Ai(transcript); 
   console.log(actionItems);

    const doc = await Transcript.create({
      rawText: transcript,
      actionItems, // <-- saves array directly
    });

   //now we will store that in the database


  res.status(200).json( { actionItems });


}


//Crud Operation 

export const add_task = async (req, res) => {
  try {
    const { transcriptId, task, owner, dueDate } = req.body;

    if (!isValidObjectId(transcriptId))
      return res.status(400).json({ error: "Invalid transcriptId" });

    if (!task || task.trim().length < 2)
      return res.status(400).json({ error: "Task is required (min 2 chars)" });

    const doc = await Transcript.findById(transcriptId);
    if (!doc) return res.status(404).json({ error: "Transcript not found" });

    doc.actionItems.push({
      task: task.trim(),
      owner: owner ? owner.trim() : null,
      dueDate: dueDate || null,
    });

    await doc.save();

    return res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteTask = async (req, res) => {
  try {
    const { actionItemId, transcriptId } = req.body;

    if (!isValidObjectId(transcriptId) || !isValidObjectId(actionItemId))
      return res.status(400).json({ error: "Invalid IDs" });

    const doc = await Transcript.findById(transcriptId);
    if (!doc) return res.status(404).json({ error: "Transcript not found" });

    const item = doc.actionItems.id(actionItemId);
    if (!item) return res.status(404).json({ error: "Task not found" });

    item.deleteOne();

    await doc.save();

    return res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




export const edit_task = async (req, res) => {
  try {
    const { actionItemId, transcriptId, task, owner, dueDate, done } = req.body;

    if (!isValidObjectId(transcriptId) || !isValidObjectId(actionItemId))
      return res.status(400).json({ error: "Invalid IDs" });

    const doc = await Transcript.findById(transcriptId);
    if (!doc) return res.status(404).json({ error: "Transcript not found" });

    const item = doc.actionItems.id(actionItemId);
    if (!item) return res.status(404).json({ error: "Task not found" });

    // Only update provided fields
    if (task !== undefined) {
      if (!task.trim())
        return res.status(400).json({ error: "Task cannot be empty" });
      item.task = task.trim();
    }

    if (owner !== undefined) {
      item.owner = owner ? owner.trim() : null;
    }

    if (dueDate !== undefined) {
      item.dueDate = dueDate || null;
    }

    if (done !== undefined) {
      if (typeof done !== "boolean")
        return res.status(400).json({ error: "Done must be boolean" });
      item.done = done;
    }

    await doc.save();

    return res.status(200).json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

