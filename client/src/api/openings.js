import client from "./client";

const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const getOpeningById = async ({ openingId }) => {
  try {
    const response = await client.post(
      `/openings/${openingId}/get`,
      { openingId },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

export async function getCoachOpenings({ userId }) {
  try {
    const response = await client.post(
      `/openings/coach/${userId}`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        validateStatus: (status) => status < 500,
      }
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createCustomOpening({
  userId,
  openingName,
  as,
  movesArray,
}) {
  try {
    const response = await client.post(
      "/openings/create-custom",
      { userId, openingName, as, movesArray },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        validateStatus: (status) => status < 500,
      }
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getOpeningMoves({ openingId }) {
  try {
    const response = await client.post(
      `/openings/${openingId}/moves`,
      { openingId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        validateStatus: (status) => status < 500,
      }
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateOpeningMoves({ openingId, openingMoves }) {
  try {
    const response = await client.post(
      `/openings/${openingId}/moves/update`,
      { openingId, openingMoves },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        validateStatus: (status) => status < 500,
      }
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateOpening({ openingId, updateData }) {
  try {
    const response = await client.post(
      `/openings/${openingId}/update`,
      { openingId, updateData },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        validateStatus: (status) => status < 500,
      }
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCustomOpening({ openingId, userId }) {
  try {
    const response = await client.post(
      `/openings/${openingId}/delete`,
      { userId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        validateStatus: (status) => status < 500,
      }
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

