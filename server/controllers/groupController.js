import GroupService from "../services/groupService.js";

export const createGroup = async (req, res) => {
  try {
    const group = await GroupService.createGroup(req.body);
    if (!group) {
      throw new Error("Group creation failed!");
    }
    res.status(201).json(group);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Group creation failed!",
    });
  }
};

export const fetchGroupOwner = async (req, res) => {
  try {
    const owner = await GroupService.getGroupOwner(req.body);
    if (!owner) {
      throw new Error("Fetching group owner failed!");
    }
    res.status(200).json(owner);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching group owner failed!",
    });
  }
};

export const fetchOwnerGroups = async (req, res) => {
  try {
    const ownerGroups = await GroupService.getOwnerGroups(req.user.id);
    if (!ownerGroups) {
      throw new Error("Fetching owner groups failed!");
    }
    res.status(200).json(ownerGroups);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching owner groups failed!",
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const group = await GroupService.deleteGroup(groupId);
    if (!group) {
      throw new Error("Deleting group failed!");
    }
    res.status(200).json(group);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Deleting group failed!",
    });
  }
};

export const fetchGroupById = async (req, res) => {
  try {
    const group = await GroupService.getGroupById(req.body.groupId);
    if (!group) {
      throw new Error("Fetching group failed!");
    }
    res.status(200).json(group);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching group failed!",
    });
  }
};

export const updateGroupOpening = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const { openingId } = req.body;
    const result = await GroupService.updateGroupOpening(groupId, openingId);
    if (!result[0]) {
      throw new Error("Updating group's opening failed!");
    }
    res.status(200).json({ message: "Group opening updated successfully." });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Updating group's opening failed!",
    });
  }
};

export const editGroupName = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { groupName } = req.body;
    const group = await GroupService.editGroupName(groupId, groupName);
    if (!group) {
      throw new Error("Updating group's name failed!");
    }
    res.status(200).json({ message: "Group name updated successfully." });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Updating group's name failed!",
    });
  }
}