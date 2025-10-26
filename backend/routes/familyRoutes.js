import express from "express";
import { registerFamily, loginFamily, getFamilies, getFamilyProfile, changeFamilyPassword, deleteFamilyAccount } from "../controllers/familyController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerFamily);
router.post("/login", loginFamily);
router.get("/", protect, getFamilies); // protected route
router.get("/profile", protect, getFamilyProfile);
router.put("/change-password", protect, changeFamilyPassword);
router.delete("/delete-account", protect, deleteFamilyAccount);

export default router;
