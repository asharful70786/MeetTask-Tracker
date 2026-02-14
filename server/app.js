import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import transcriptRoutes from "./Routes/transcriptRoutes.js";
import SendEmail_service from "./Services/sendMail.js";
import statusRoutes from "./Routes/statusRoutes.js";




connectDB();

dotenv.config();

const app = express();


app.use(cors({ 
  origin:  process.env.CORS_ORIGIN ,
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
app.use("/api", statusRoutes);



app.post("/api/send-email", async (req, res) => {
  try {
    const { email, task } = req.body;
   
    if (!email || !task) return res.status(400).json({ message: "Email and task are required" }); 

    const result = await SendEmail_service({email,task});

    return res.status(200).json({ message: "Email sent successfully",result });

  } catch (err) {
    console.error("Send email error:", err);
    return res.status(500).json({ message: "Failed to send email" });
  }
});





app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
