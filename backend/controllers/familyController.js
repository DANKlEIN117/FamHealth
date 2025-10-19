import Family from "../models/Family.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register Family
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



export const loginFamily = async (req, res) => {
  const { email, password } = req.body;

  try {
    const family = await Family.findOne({ email });
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    const isMatch = await bcrypt.compare(password, family.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: family._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      _id: family._id,
      familyName: family.familyName,
      email: family.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getFamilies = async (req, res) => {
  try {
    const families = await Family.find().populate("members");
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFamilyProfile = async (req, res) => {
  try {
    const family = await Family.findById(req.user._id).populate("members");
    if (!family) return res.status(404).json({ message: "Family not found" });

    res.json({
      _id: family._id,
      familyName: family.familyName,
      email: family.email,
      members: family.members, // 👈 includes all members
    });
  } catch (error) {
    console.error("Error fetching family profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

