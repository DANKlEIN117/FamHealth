import express from "express";
import {
  registerFamily,
  loginFamily,
  getFamilyProfile,
  changeFamilyPassword,
  deleteFamilyAccount,
  updateFamily,
  uploadProfilePhoto,
} from "../controllers/familyController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register", registerFamily);
router.post("/login", loginFamily);
router.get("/profile", protect, getFamilyProfile);
router.put("/change-password", protect, changeFamilyPassword);
router.delete("/delete-account", protect, deleteFamilyAccount);
router.put("/update", protect, updateFamily);
router.post("/upload-profile", protect, upload.single("photo"), uploadProfilePhoto);

export default router;
