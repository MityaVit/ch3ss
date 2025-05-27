import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  fetchOpeningById,
  fetchCoachOpenings,
  createCustomOpening,
  updateOpening,
  deleteCustomOpening,
} from "../controllers/openingController.js";
import {
  fetchOpeningMovesById,
  updateOpeningMoves,
} from "../controllers/openingMovesController.js";

const router = express.Router();

router.post("/openings/:id/get", authMiddleware, fetchOpeningById);
router.post("/openings/:id/moves", authMiddleware, fetchOpeningMovesById);
router.post("/openings/:id/moves/update", authMiddleware, updateOpeningMoves);
router.post("/openings/:id/update", authMiddleware, updateOpening);
router.post("/openings/coach/:id", authMiddleware, fetchCoachOpenings);
router.post("/openings/create-custom", authMiddleware, createCustomOpening);
router.post("/openings/:id/delete", authMiddleware, deleteCustomOpening);

export default router;
