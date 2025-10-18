import cron from "node-cron";
import nodemailer from "nodemailer";
import Family from "../models/Family.js";

// --- Setup your email transporter ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- Function to send email ---
const sendEmail = async (to, subject, message) => {
  try {
    await transporter.sendMail({
      from: `"FamHealth AI" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `<p>${message}</p>`,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
};

// --- Automated daily check (every day at 8AM) ---
cron.schedule("0 8 * * *", async () => {
  console.log("🕗 Running daily health reminder check...");

  const families = await Family.find().populate("members");

  for (const family of families) {
    for (const member of family.members) {
      if (!member.reminders) continue;

      member.reminders.forEach(reminder => {
        const today = new Date().toISOString().split("T")[0];
        if (reminder.date === today) {
          const message = `
            Hello ${member.name},<br/>
            Reminder: It's time to take your medicine: <b>${reminder.drugName}</b><br/>
            Dosage: ${reminder.dosage}<br/>
            Time: ${reminder.time}<br/>
            Stay healthy, FamHealth AI is watching over you 💚
          `;
          sendEmail(family.email, "💊 Drug Reminder Alert", message);
        }
      });
    }
  }
});
