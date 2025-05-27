import client from "./client";

const getAuthToken = () => localStorage.getItem('authToken');

export const getGroupMembers = async (groupId) => {
    try {
       const response = await client.post(`/${groupId}/members`,
        groupId,
        {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
            validateStatus: (status) => status < 500,
        }
       );

        if (response.status >= 400) {
            (response.data?.message || 'Unknown error');
        }
        return response; 
    } catch (error) {
        throw error;
    };
};

export const getUserGroups = async (userId) => {
    try {
       const response = await client.get(`/user/${userId}/groups`,
        {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
            validateStatus: (status) => status < 500,
        }
       );

        return response; 
    } catch (error) {
        throw error;
    };
};

export const addGroupMember = async (groupMemberData) => {
    try {
        const { groupId } = groupMemberData;
        const response = await client.post(`/${groupId}/members/add`,
            groupMemberData,
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                validateStatus: (status) => status < 500,
            }
        );

    } catch (error) {
        throw error;
    }
};

export const removeGroupMember = async (groupMemberData) => {
    try {
        const { groupId } = groupMemberData;
        const response = await client.post(`/${groupId}/members/remove`,
            groupMemberData,
            {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                },
                validateStatus: (status) => status < 500,
            }
        );

    } catch (error) {
        throw error;
    }
};