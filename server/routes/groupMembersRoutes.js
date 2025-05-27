import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  addGroupMember,
  removeGroupMember,
  fetchGroupMembers,
  fetchUserGroups,
} from "../controllers/groupMembersController.js";

const router = express.Router();

router.post("/:groupId/members/add", authMiddleware, addGroupMember);
router.post("/:groupId/members/remove", authMiddleware, removeGroupMember);
router.post("/:groupId/members", authMiddleware, fetchGroupMembers);
router.get("/user/:userId/groups", authMiddleware, fetchUserGroups);

export default router;
