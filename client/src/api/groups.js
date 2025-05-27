import client from "./client";

const getAuthToken = () => localStorage.getItem('authToken');

export const getGroups = async () => {
    try {
       const response = await client.get('/groups',
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
    };
};

export const updateGroupOpening = async (groupId, openingId) => {
    try {
        const response = await client.patch(`/groups/${groupId}/opening`,
            { openingId },
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
    }
    catch (error) {
        throw error;
    }
};

export const createGroup = async (groupData) => {
    try {
        const response = await client.post('/groups', 
            groupData,
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

export const getGroupOwner = async (groupId) => {
    try {
        const response = await client.get(`/groups/${groupId}/owner`,
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

export const getOwnerGroups = async (ownerId) => {
    try {
        const response = await client.get(`/groups/owner/${ownerId}`,
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

export const deleteGroup = async (groupId) => {
    try {
        const response = await client.delete(`/groups/${groupId}`,
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

    } catch (error) {
        throw error;
    }
};

export const getGroupById = async ({groupId}) => {
    try {
        const response = await client.post(`/groups/${groupId}`,
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

export const editGroupName = async (groupId, groupName) => {
    try {
        const response = await client.post(`/groups/${groupId}/edit-name`,
            { groupName },
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