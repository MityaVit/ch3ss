import OpeningMovesService from "../services/openingMovesService.js"

export const fetchOpeningMovesById = async (req, res) => {
  try {
    const { openingId } = req.body;
    const openingMoves = await OpeningMovesService.getOpeningMovesByOpeningId(openingId);
    if (!openingMoves) {
      throw new Error("Fetching opening moves failed!");
    }
    res.status(200).json(openingMoves);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching openingMoves failed!",
    });
  }
};

export const updateOpeningMoves = async (req, res) => {
  try {
    const { openingId, openingMoves } = req.body;
    const updatedOpeningMoves = await OpeningMovesService.updateOpeningMoves(openingId, openingMoves);
    if (!updatedOpeningMoves) {
      throw new Error("Updating opening moves failed!");
    }
    res.status(200).json(updatedOpeningMoves);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Updating opening moves failed!",
    });
  }
}