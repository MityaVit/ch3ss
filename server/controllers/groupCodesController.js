import GroupCodesService from "../services/groupCodesService.js";

export const createGroupCode = async (req, res) => {
  try {
    const { groupId } = req.body;
    const groupCode = await GroupCodesService.generateGroupCode(groupId);
    if (!groupCode) {
      throw new Error("Creating group code failed!");
    }
    res.status(201).json(groupCode);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Creating group code failed!",
    });
  }
};

export const fetchGroupCodes = async (req, res) => {
  try {
    const { groupId } = req.body;
    const groupCode = await GroupCodesService.getGroupCodes(groupId);
    if (!groupCode) {
      throw new Error("Fetching group codes failed!");
    }
    res.status(200).json(groupCode);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Fetching group codes failed!",
    });
  }
};

export const addMemberByGroupCode = async (req, res) => {
  try {
    const { code, userId } = req.body;
    const groupMember = await GroupCodesService.addMemberByGroupCode(
      code,
      userId
    );
    if (!groupMember) {
      throw new Error("Adding member by group code failed!");
    }
    res.status(201).json(groupMember);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Adding member by group code failed!",
    });
  }
};

export const removeGroupCode = async (req, res) => {
  try {
    const { id } = req.params;
    const groupCode = await GroupCodesService.removeGroupCode(id);
    if (!groupCode) {
      throw new Error("Removing group code failed!");
    }
    res.status(200).json(groupCode);
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Unknown error occurred",
      error: "Removing group code failed!",
    });
  }
}
