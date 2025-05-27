import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { 
  getOpeningAccuracy, 
  getSlidingAccuracy, 
  getStreaks, 
  getWeakMoves, 
  getUserGroupStatistics, 
  deleteUserGroupStatistics, 
  getAverageTimeToThink,
  createUserStatistics
} from "../controllers/statisticsController.js";

const router = express.Router();

// Get overall opening accuracy for the user in a group
router.post("/statistics/opening-accuracy", authMiddleware, getOpeningAccuracy);

// Get sliding accuracy for the user in a group
router.post("/statistics/sliding-accuracy", authMiddleware, getSlidingAccuracy);

// Get current and maximum streaks for the user in a group
router.post("/statistics/streaks", authMiddleware, getStreaks);

// Get weak moves for the user in a group
router.post("/statistics/weak-moves", authMiddleware, getWeakMoves);

// Get detailed statistics for the user in a group
router.post("/statistics/user-group", authMiddleware, getUserGroupStatistics);

// Delete all statistics for the user in a group
router.delete("/statistics/user-group", authMiddleware, deleteUserGroupStatistics);

// Route for creating a user's statistic record
router.post("/statistics/batch", authMiddleware, createUserStatistics);

// Route for average time to think
router.post("/statistics/avg-time", authMiddleware, getAverageTimeToThink);

export default router;
