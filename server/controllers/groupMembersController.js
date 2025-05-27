import GroupMembersService from "../services/groupMembersService.js";

export const addGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const memberToAdd = await GroupMembersService.addGroupMember(
      groupId,
      userId
    );
    if (!memberToAdd) {
      throw new Error("Adding group member failed!");
    }
    res.status(201).json(memberToAdd);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Adding group member failed!",
    });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const memberToRemove = await GroupMembersService.removeGroupMember(
      groupId,
      userId
    );
    if (!memberToRemove) {
      throw new Error("Removing group member failed!");
    }
    res.status(201).json(memberToRemove);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Removing group member failed!",
    });
  }
};

export const fetchGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.body;
    const groupMembers = await GroupMembersService.getAllGroupMembers(groupId);
    if (!groupMembers) {
      throw new Error("Fetching group members failed!");
    }
    res.status(200).json(groupMembers);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching group members failed!",
    });
  }
};

export const fetchUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const userGroups = await GroupMembersService.getUserGroups(userId);
    if (!userGroups) {
      throw new Error("Fetching user groups failed!");
    }
    res.status(200).json(userGroups);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching user groups failed!",
    });
  }
};
