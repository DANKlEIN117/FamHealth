import Member from "../models/Member.js";

// Add a new drug reminder
export const addReminder = async (req, res) => {
  try {
    const { memberId, medicine, dosage, time, note } = req.body;

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const newReminder = { medicine, dosage, time, note };
    member.reminders.push(newReminder);
    await member.save();

    res.status(201).json({ message: "Reminder added successfully", reminder: newReminder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reminders for a member
export const getReminders = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    res.json(member.reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get upcoming reminders (next 24 hours)
export const getUpcomingReminders = async (req, res) => {
  try {
    const { memberId } = req.params;
    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const upcoming = member.reminders.filter(
      (rem) => new Date(rem.time) >= now && new Date(rem.time) <= nextDay
    );

    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark a reminder as done
export const markReminderDone = async (req, res) => {
  try {
    const { memberId, reminderId } = req.body;

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const reminder = member.reminders.id(reminderId);
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    reminder.status = "done";
    await member.save();

    res.json({ message: "Reminder marked as done" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
