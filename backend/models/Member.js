import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  medicine: { type: String, required: true },
  dosage: { type: String },
  time: { type: Date, required: true }, // specific date/time
  note: { type: String },
  status: { type: String, default: "pending" } // pending | done | missed
});

const memberSchema = new mongoose.Schema({
  name: String,
  age: Number,
  healthIssues: [String],
  reminders: [
    {
      drugName: String,
      dosage: String,
      date: String, // YYYY-MM-DD
      time: String, // e.g. "08:00"
    },
  ],
});


export default mongoose.model("Member", memberSchema);
