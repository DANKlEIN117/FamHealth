import express from "express";
import { addMember } from "../controllers/memberController.js";
const router = express.Router();

router.post("/add", addMember);

export default router;
