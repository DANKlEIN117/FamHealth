import Member from "../models/Member.js";


export const addMember = async (req, res) => {
  try {
    const { name, role } = req.body;
    const familyId = req.user.id;
    const member = await Member.create({ name, role, family: familyId });
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const getMembers = async (req, res) => {
  try {
    const members = await Member.find({ family: req.user.id });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
