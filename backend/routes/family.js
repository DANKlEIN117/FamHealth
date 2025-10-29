import express from "express";
import upload from "../middleware/upload.js";
import Family from "../models/Family.js";

const router = express.Router();

// Profile picture upload route
router.post("/family/upload-profile", upload.single("profilePic"), async (req, res) => {
  try {
    const { id } = req.body;
    const family = await Family.findById(id);

    if (!family) return res.status(404).json({ message: "Family not found" });

    family.profilePic = req.file.path; // Cloudinary URL
    await family.save();

    res.json({ message: "Profile updated successfully", url: req.file.path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Upload failed" });
  }
});

export default router;
