import express from "express";
import { add_task, deleteTask, edit_task, getTranscripts, individual_Transcript, saveTranscript } from "../Controllers/transcriptControllers.js";

const router = express.Router();


router.post("/extract", saveTranscript);

router.get("/recent", getTranscripts);
router.get("/:id", individual_Transcript);

//crud 

router.post("/add-task", add_task);
router.delete("/delete" , deleteTask);
router.patch("/edit", edit_task);

export default router;

