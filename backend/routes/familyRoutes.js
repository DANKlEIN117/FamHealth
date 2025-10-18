import express from "express";
import { registerFamily, loginFamily, getFamilies } from "../controllers/familyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerFamily);
router.post("/login", loginFamily);
router.get("/", protect, getFamilies); // protected route

export default router;
