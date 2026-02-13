async function handleSendEmail(task) {
  const email = window.prompt("Enter email address:");

  if (!email) return; // user cancelled

  const trimmed = email.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    alert("Invalid email address");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: trimmed,
        task, // send full task object
      }),
    });

    if (!res.ok) throw new Error("Failed to send email");

    alert("Email sent successfully.");
  } catch (err) {
    alert("Something went wrong.");
  }
}


export default handleSendEmail;