import client from "./client";

const getAuthToken = () => localStorage.getItem('authToken');

export const createGroupCode = async (groupId) => {
    try {
        const response = await client.post(`/groups/${groupId}/code/create`,
            { groupId },
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                validateStatus: (status) => status < 500,
            }
        );

        if (response.status >= 400) {
            throw new Error(response.data?.message || response.data?.error || 'Unknown error');
        }

        return response;
    } catch (error) {
        throw error;
    }
};

export const fetchGroupCodes = async (groupId) => {
    try {
        const response = await client.post(`/groups/${groupId}/codes`,
            { groupId },
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                validateStatus: (status) => status < 500,
            }
        );

        if (response.status >= 400) {
            throw new Error(response.data?.message || 'Unknown error');
        }

        return response;
    } catch (error) {
        throw error;
    }
};

export const redeemGroupCode = async (code, userId) => {
    try {
        const response = await client.post(`/groups/code/redeem`,
            { code, userId },
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                validateStatus: (status) => status < 500,
            }
        );

        if (response.status >= 400) {
            throw new Error(response.data?.message || 'Unknown error');
        }

        return response;
    } catch (error) {
        throw error;
    }
};

export const removeGroupCode = async (groupCodeId) => {
    try {
        const response = await client.delete(`/groups/code/${groupCodeId}/remove`,
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                validateStatus: (status) => status < 500,
            }
        );

        if (response.status >= 400) {
            throw new Error(response.data?.message || 'Unknown error');
        }

        return response;
    } catch (error) {
        throw error;
    }
}
