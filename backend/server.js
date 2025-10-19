import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import familyRoutes from "./routes/familyRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import "./utils/notificationService.js";


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/family", familyRoutes);
app.use("/api/members", memberRoutes);

app.get("/", (req, res) => {
  res.send("FamHealth AI Backend Running ✅");
});

import aiRoutes from "./routes/aiRoutes.js";
app.use("/api/ai", aiRoutes);

import reminderRoutes from "./routes/reminderRoutes.js";
app.use("/api/reminders", reminderRoutes);


app.use("/api/members", memberRoutes);





// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
