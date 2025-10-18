import express from "express";
import { addMember, getMembers, updateMember, deleteMember } from "../controllers/memberController.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, addMember);     // Add member
router.get("/", protect, getMembers);     // Get all family members
router.put("/:id", protect, updateMember); // Update member
router.delete("/:id", protect, deleteMember); // Delete member

export default router;
