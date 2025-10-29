import Family from "../models/Family.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Member from "../models/Member.js";

// ✅ Register Family
export const registerFamily = async (req, res) => {
  try {
    const { familyName, email, password } = req.body;
    const existing = await Family.findOne({ email });
    if (existing) return res.status(400).json({ message: "Family already exists" });

    const family = await Family.create({ familyName, email, password });

    res.status(201).json({
      _id: family._id,
      familyName: family.familyName,
      email: family.email,
      token: generateToken(family._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login Family
export const loginFamily = async (req, res) => {
  const { email, password } = req.body;
  try {
    const family = await Family.findOne({ email });
    if (!family) return res.status(404).json({ message: "Family not found" });

    const isMatch = await bcrypt.compare(password, family.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: family._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      _id: family._id,
      familyName: family.familyName,
      email: family.email,
      profilePic: family.profilePic,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Logged-in Family Profile
export const getFamilyProfile = async (req, res) => {
  try {
    const family = await Family.findById(req.user._id).populate("members");
    if (!family) return res.status(404).json({ message: "Family not found" });

    res.json({
      _id: family._id,
      familyName: family.familyName,
      email: family.email,
      members: family.members,
      profilePic: family.profilePic,
    });
  } catch (error) {
    console.error("Error fetching family profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Change Password
export const changeFamilyPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const family = await Family.findById(req.user.id);
    if (!family) return res.status(404).json({ message: "Family not found" });

    const isMatch = await family.matchPassword(oldPassword);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    family.password = newPassword;
    await family.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Account
export const deleteFamilyAccount = async (req, res) => {
  try {
    await Family.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Upload Profile Photo (only one per user)
export const uploadProfilePhoto = async (req, res) => {
  try {
    const familyId = req.user._id;
    const family = await Family.findById(familyId);
    if (!family) return res.status(404).json({ message: "Family not found" });

    // multer-storage-cloudinary handles upload automatically
    family.profilePic = req.file.path; 
    await family.save();

    res.json({
      message: "Profile photo updated successfully",
      photoUrl: req.file.path,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// ✅ Update Info
export const updateFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.user.id);
    if (!family) return res.status(404).json({ message: "Family not found" });

    family.familyName = req.body.familyName || family.familyName;
    family.email = req.body.email || family.email;

    const updatedFamily = await family.save();
    res.json({
      _id: updatedFamily._id,
      familyName: updatedFamily.familyName,
      email: updatedFamily.email,
      profilePic: updatedFamily.profilePic,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
