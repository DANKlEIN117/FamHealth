import express from "express";
import {
  registerFamily,
  loginFamily,
  getFamilies,
  getFamilyProfile,
  changeFamilyPassword,
  deleteFamilyAccount,
  deleteMember,
  updateFamily,
  uploadProfilePhoto,
} from "../controllers/familyController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register", registerFamily);
router.post("/login", loginFamily);
router.get("/", protect, getFamilies);
router.get("/profile", protect, getFamilyProfile);
router.put("/change-password", protect, changeFamilyPassword);
router.delete("/delete-account", protect, deleteFamilyAccount);
router.delete("/members/:memberId", protect, deleteMember);
router.put("/update", protect, updateFamily);

// ✅ Profile Upload
router.post("/upload-profile", protect, upload.single("photo"), uploadProfilePhoto);

export default router;
