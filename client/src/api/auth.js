import client from "./client";

export async function sendPasswordRecoveryLink(email) {
  try {
    const response = await client.post(
      "/password-recovery",
      { email },
      {
        validateStatus: (status) => status < 500,
      }
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(token, newPassword) {
  try {
    const response = await client.post(
      "/password-reset",
      { token, newPassword },
      {
        validateStatus: (status) => status < 500,
      }
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response;
  } catch (error) {
    throw error;
  }
}

export async function activateAccount(token) {
  try {
    const response = await client.get(`/email-activation?token=${token}`, {
      validateStatus: (status) => status < 500,
    });
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response;
  } catch (error) {
    throw error;
  }
}

export async function sendEmailConfirmation(email) {
  try {
    const response = await client.post(
      "/email-confirmation", 
      { email },
      { validateStatus: (status) => status < 500 }
    );
    if (response.status >= 400) {
      throw new Error(response.data?.message || "Unknown error");
    }
    return response;
  } catch (error) {
    throw error;
  }
}
