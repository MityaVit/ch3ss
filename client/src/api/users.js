import client from "./client";

const getAuthToken = () => localStorage.getItem("authToken");

export const getUsers = async () => {
  try {
    const response = await client.get("/users/all", {
      validateStatus: (status) => status < 500,
    });

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async ({ userId }) => {
  try {
    const response = await client.post(
      `/users/${userId}`,
      { userId },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const authUser = async (data) => {
  try {
    const response = await client.post("/users/login", data, {
      validateStatus: (status) => status < 500,
    });

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    localStorage.setItem("authToken", response.data.token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUsernameByUserId = async (userId) => {
  try {
    const response = await client.get(`/users/${userId}/username`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserOpenings({ userId }) {
  try {
    const response = await client.post(
      `/users/${userId}/openings`,
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
      throw new Error(response.data?.message || "Failed to fetch openings");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserOpeningsByGroupId({ userId, groupId }) {
  try {
    const response = await client.post(
      `/users/${userId}/openings/group/${groupId}`,
      { userId, groupId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        validateStatus: (status) => status < 500,
      }
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Failed to fetch openings by group id");
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const createUser = async (userData) => {
  try {
    const response = await client.post("/users/create", userData, {
      validateStatus: (status) => status < 500,
    });

    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("authToken");
};

export const fetchUserData = async (token) => {
  try {
    const response = await client.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
};
