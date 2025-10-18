import express from "express";
import { getHealthAdvice } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// GET health advice for a specific member
router.get("/:memberId", protect, getHealthAdvice);

export default router;
