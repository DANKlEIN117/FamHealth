import mongoose from "mongoose";

const sosSchema = new mongoose.Schema({
  family: { type: mongoose.Schema.Types.ObjectId, ref: "Family" },
  location: {
    lat: Number,
    lon: Number,
  },
  hospitals: { type: Array, default: [] },
  targetHospital: { type: Object, default: null },
  note: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("SOS", sosSchema);
