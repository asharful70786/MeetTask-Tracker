import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import transcriptRoutes from "./Routes/transcriptRoutes.js";



connectDB();

dotenv.config();

const app = express();


app.use(cors({ 
  origin: "http://meeting.zenpix.shop",
  credentials: true,
}));


app.use(express.json()); 

app.get("/", (req , res) => {
  res.send("Hello World!");
});
app.get("/status", (req, res) => {
  res.json({ ok: true, service: "backend", timestamp: new Date().toISOString() });
});


app.use("/api/transcript", transcriptRoutes);


app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
