import Member from "../models/Member.js";
import Family from "../models/Family.js";

export const addMember = async (req, res) => {
  try {
    const { name, role } = req.body;
    const familyId = req.user._id;

    // 1️⃣ Create the member
    const member = await Member.create({ name, role, family: familyId });

    // 2️⃣ Push this member into the family's members array
    await Family.findByIdAndUpdate(familyId, {
      $push: { members: member._id },
    });

    res.status(201).json(member);
  } catch (err) {
    console.error("Add member error:", err);
    res.status(400).json({ message: err.message });
  }
};

export const getMembers = async (req, res) => {
  try {
    const familyId = req.user._id;
    const members = await Member.find({ family: familyId });
    res.json(members);
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ message: "Server error while fetching members" });
  }
};

export const updateMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    // 1️⃣ Remove from Family members list
    await Family.findByIdAndUpdate(member.family, {
      $pull: { members: member._id },
    });

    // 2️⃣ Delete the member
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
