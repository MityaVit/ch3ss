import client from "./client";

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

const authHeaders = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  },
  validateStatus: (status) => status < 500,
});

export const getOpeningAccuracy = async ({ userId, groupId }) => {
  try {
    const response = await client.post(
      "/statistics/opening-accuracy",
      { userId, groupId },
      authHeaders()
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSlidingAccuracy = async ({ userId, groupId, windowDays }) => {
  try {
    const response = await client.post(
      "/statistics/sliding-accuracy",
      { userId, groupId, windowDays },
      authHeaders()
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStreaks = async ({ userId, groupId }) => {
  try {
    const response = await client.post(
      "/statistics/streaks",
      { userId, groupId },
      authHeaders()
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWeakMoves = async ({ userId, groupId, weakThreshold }) => {
  try {
    const response = await client.post(
      "/statistics/weak-moves",
      { userId, groupId, weakThreshold },
      authHeaders()
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserGroupStatistics = async ({ userId, groupId }) => {
  try {
    const response = await client.post(
      "/statistics/user-group",
      { userId, groupId },
      authHeaders()
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUserGroupStatistics = async ({ userId, groupId }) => {
  try {
    const response = await client.delete("/statistics/user-group", {
      ...authHeaders(),
      data: { userId, groupId },
    });

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createUserStatisticsBatch = async (dataArray) => {
  try {
    const response = await client.post(
      "/statistics/batch",
      dataArray,
      authHeaders()
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvgTime = async ({ userId, groupId }) => {
  try {
    const response = await client.post(
      "/statistics/avg-time",
      { userId, groupId },
      authHeaders()
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};
