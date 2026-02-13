import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function SendEmail_service({ email, task }) {

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  return res.status(400).json({ message: "Invalid email format" });
}

const html = `
  <div style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    
    <div style="max-width:520px;margin:40px auto;padding:0 16px;">
      
      <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,0.08);">
        
        <!-- Top Brand Strip -->
        <div style="background:#0A4B3A;padding:16px 24px;color:white;">
          <h2 style="margin:0;font-size:18px;font-weight:600;letter-spacing:0.5px;">
            Meeting Action Items Tracker
          </h2>
        </div>

        <!-- Body -->
        <div style="padding:24px;">
          
          <p style="margin:0 0 16px;font-size:15px;color:#555;">
            You have a task reminder:
          </p>

          <!-- Task Card -->
          <div style="background:#f9fafb;border-radius:14px;padding:18px;border:1px solid #e6e6e6;">
            
            <p style="margin:0 0 10px;font-size:16px;font-weight:600;color:#111;">
              ${task.task}
            </p>

            <p style="margin:4px 0;font-size:14px;color:#444;">
              <strong>Owner:</strong> ${task.owner || "Not assigned"}
            </p>

            <p style="margin:4px 0;font-size:14px;color:#444;">
              <strong>Due:</strong> ${task.dueDate || "Not specified"}
            </p>

            <p style="margin:4px 0;font-size:14px;color:${task.done ? "#16a34a" : "#dc2626"};">
              <strong>Status:</strong> ${task.done ? "Completed" : "Pending"}
            </p>

          </div>

          <div style="margin-top:24px;font-size:13px;color:#777;text-align:center;">
            This reminder was generated automatically from your task dashboard.
          </div>

        </div>
      </div>

      <div style="text-align:center;margin-top:16px;font-size:12px;color:#aaa;">
        © ${new Date().getFullYear()} Meeting Action Items Tracker
      </div>

    </div>
  </div>
`;



 

  const response = await resend.emails.send({
   from: "Meeting Action Items Tracker <support@zenpix.shop>", 
    to: email,
    subject: "Task Reminder",
    html,
  });

  return response;
}
