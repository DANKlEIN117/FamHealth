import express from "express";
import protect from "../middleware/authMiddleware.js";
import { sendSOS } from "../controllers/emergencyController.js";

const router = express.Router();

router.post("/sos", protect, sendSOS);

export default router;
