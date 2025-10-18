import Member from "../models/Member.js";
import Family from "../models/Family.js";

export const addMember = async (req, res) => {
  try {
    const { familyId, name, age, gender, healthHistory } = req.body;
    const family = await Family.findById(familyId);
    if (!family) return res.status(404).json({ message: "Family not found" });

    const member = await Member.create({ name, age, gender, healthHistory, family: familyId });
    family.members.push(member._id);
    await family.save();

    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
