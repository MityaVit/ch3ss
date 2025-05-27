import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addMemberByGroupCode,
  createGroupCode,
  fetchGroupCodes,
  removeGroupCode,
} from "../controllers/groupCodesController.js";

const router = express.Router();

router.post("/groups/:groupId/code/create", authMiddleware, createGroupCode);
router.post("/groups/:groupId/codes", authMiddleware, fetchGroupCodes);
router.post("/groups/code/redeem", authMiddleware, addMemberByGroupCode);
router.delete("/groups/code/:id/remove", authMiddleware, removeGroupCode);

export default router;
