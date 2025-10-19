import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  medicine: { type: String, required: true },
  dosage: { type: String },
  time: { type: Date, required: true },
  note: { type: String },
  status: { type: String, enum: ["pending", "done"], default: "pending" },
});

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Family",
    required: true,
  },
  reminders: [reminderSchema], // 👈 this enables reminders
});

export default mongoose.model("Member", memberSchema);
