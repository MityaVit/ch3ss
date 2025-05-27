import * as statisticsService from "../services/statisticsService.js";

export const getOpeningAccuracy = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const accuracy = await statisticsService.getOpeningAccuracy(
      userId,
      groupId
    );
    res.status(200).json({ accuracy });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching opening accuracy failed!",
    });
  }
};

export const getSlidingAccuracy = async (req, res) => {
  try {
    const { userId, groupId, windowDays } = req.body;
    const slidingAccuracy = await statisticsService.getSlidingAccuracy(
      userId,
      groupId,
      windowDays
    );
    res.status(200).json({ slidingAccuracy });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching sliding accuracy failed!",
    });
  }
};

export const getStreaks = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const streaks = await statisticsService.getStreaks(userId, groupId);
    res.status(200).json(streaks);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching streaks failed!",
    });
  }
};

export const getWeakMoves = async (req, res) => {
  try {
    const { userId, groupId, weakThreshold } = req.body;
    const weakMoves = await statisticsService.getWeakMoves(
      userId,
      groupId,
      weakThreshold
    );
    res.status(200).json(weakMoves);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching weak moves failed!",
    });
  }
};

export const getUserGroupStatistics = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const stats = await statisticsService.getUserGroupStatistics(
      userId,
      groupId
    );
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching user group statistics failed!",
    });
  }
};

export const deleteUserGroupStatistics = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const result = await statisticsService.deleteUserGroupStatistics(
      userId,
      groupId
    );
    res.status(200).json({ message: "User group statistics deleted", result });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Deleting user group statistics failed!",
    });
  }
};

export const calculateGroupMetrics = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const metrics = await statisticsService.calculateGroupMetrics(
      userId,
      groupId
    );
    res.status(200).json(metrics);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Calculating group metrics failed!",
    });
  }
};

export const createUserStatistics = async (req, res) => {
  console.log(req.body);
  try {
    const data = req.body;
    const statistic = await statisticsService.createUserStatistics(data);
    res.status(201).json(statistic);
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Creating user statistics failed!",
    });
  }
};

export const getAverageTimeToThink = async (req, res) => {
  try {
    const { userId, groupId } = req.body;
    const averageTime = await statisticsService.getAverageTimeToThink(userId, groupId);
    res.status(200).json({ averageTime });
  } catch (error) {
    res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching average time to think failed!"
    });
  }
};
