import OpeningService from "../services/openingService.js";

export const deleteCustomOpening = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const opening = await OpeningService.deleteCustomOpening(id, userId);
    if (!opening) {
      throw new Error("Removing opening failed!");
    }
    res.status(200).json(opening);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Removing opening failed!",
    });
  }
};

export const updateOpening = async (req, res) => {
  try {
    const { openingId, updateData } = req.body;
    const opening = await OpeningService.updateOpening(openingId, updateData);
    if (!opening) {
      throw new Error("Updating opening failed!");
    }
    res.status(200).json(opening);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Updating opening failed!",
    });
  }
};

export const fetchOpeningById = async (req, res) => {
  try {
    const { openingId, changes } = req.body;
    const opening = await OpeningService.getOpeningById(openingId, changes);
    if (!opening) {
      throw new Error("Opening not found!");
    }
    res.status(200).json(opening);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching opening failed!",
    });
  }
};

export const fetchCoachOpenings = async (req, res) => {
  const { userId } = req.body;
  try {
    const openings = await OpeningService.getCoachOpenings(userId);
    if (!openings) {
      throw new Error("Fetching coach openings failed!");
    }
    res.status(200).json(openings);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching coach openings failed!"
    });
  }
};

export const fetchUserOpenings = async (req, res) => {
  try {
    const { userId } = req.body;
    const openings = await OpeningService.getUserOpenings(userId);
    if (!openings) {
      throw new Error("Openings not found!");
    }
    res.status(200).json(openings);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occured",
      error: "Fetching user's openings failed!",
    })
  }
};

export const createCustomOpening = async (req, res) => {
  try {
    const { userId, openingName, as, movesArray } = req.body;
    const opening = await OpeningService.createCustomOpening(userId, openingName, as, movesArray);
    res.status(201).json(opening);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Creating custom opening failed!",
    });
  }
};

export const fetchUserOpeningsByGroupId = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const openings = await OpeningService.getUserOpeningsByGroupId(userId, groupId);
    if (!openings) {
      throw new Error("Openings not found!");
    }
    res.status(200).json(openings);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching user's openings by group ID failed!",
    });
  }
}
