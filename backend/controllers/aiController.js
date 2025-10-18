import Member from "../models/Member.js";
import { analyzeHealth } from "../ai/healthAdvisor.js";

export const getHealthAdvice = async (req, res) => {
  try {
    const { memberId } = req.params;
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const advice = analyzeHealth(member);
    res.json(advice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
