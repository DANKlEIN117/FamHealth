import express from "express";
import {
  addReminder,
  getReminders,
  getUpcomingReminders,
  markReminderDone,
} from "../controllers/reminderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addReminder);
router.get("/:memberId", protect, getReminders);
router.get("/:memberId/upcoming", protect, getUpcomingReminders);
router.put("/done", protect, markReminderDone);

export default router;
