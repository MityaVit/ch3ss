import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createGroup,
  fetchGroupOwner,
  fetchOwnerGroups,
  deleteGroup,
  fetchGroupById,
  updateGroupOpening,
  editGroupName,
} from "../controllers/groupController.js";

const router = express.Router();

router.post("/groups", authMiddleware, createGroup);

router.get("/groups/owner/:ownerId", authMiddleware, fetchOwnerGroups);

router.get("/groups/:groupId/owner", authMiddleware, fetchGroupOwner);

router.delete("/groups/:groupId", authMiddleware, deleteGroup);

router.post("/groups/:groupId", authMiddleware, fetchGroupById);

router.patch("/groups/:groupId/opening", authMiddleware, updateGroupOpening);

router.post("/groups/:groupId/edit-name", authMiddleware, editGroupName);

export default router;
