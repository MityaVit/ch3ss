import express from "express";
import {
  createUser,
  fetchUsers,
  authUser,
  fetchUserById,
  fetchUserByToken,
  fetchUsernameByUserId,
} from "../controllers/userController.js";
import { fetchUserOpenings, fetchUserOpeningsByGroupId } from "../controllers/openingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// For fetching all users
router.post("/users/all", authMiddleware, fetchUsers);

// For creating and logging in users
router.post("/users/create", createUser);

// For logging in users
router.post("/users/login", authUser);

// For authentication
router.get("/user", authMiddleware, fetchUserByToken);

// For fetching user by ID
router.post("/users/:id", authMiddleware, fetchUserById);

// For getting openings that are assigned to the user
router.post("/users/:userId/openings", authMiddleware, fetchUserOpenings);

// For getting openings that are assigned to the user by group ID
router.post("/users/:userId/openings/group/:groupId", authMiddleware, fetchUserOpeningsByGroupId);

// For getting user's username by user's ID
router.get("/users/:id/username", authMiddleware, fetchUsernameByUserId);

export default router;
