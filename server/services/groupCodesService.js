import GroupCodes from "../models/groupCodes.js";
import GroupMembers from "../models/groupMembers.js";

const generateGroupCode = async (groupId) => {
  try {
    const memberCount = await GroupMembers.count({ where: { idGroup: groupId } });
    if (memberCount >= parseInt(process.env.MAX_GROUP_SIZE, 10)) {
      throw new Error("Максимальное количество участников группы достигнуто!");
    }
    const groupCode = await GroupCodes.create({
      GroupID: groupId,
    });
    return groupCode;
  } catch (error) {
    throw new Error(error);
  }
};

const addMemberByGroupCode = async (code, userId) => {
  try {
    const groupCode = await GroupCodes.findOne({ where: { Code: code } });
    if (!groupCode) {
      throw new Error("Код группы не найден!");
    }
    if (groupCode.IsCodeUsed) {
      throw new Error("Код группы уже использован!");
    }
    groupCode.IsCodeUsed = true;
    await groupCode.save();

    const groupMember = await GroupMembers.create({
      idGroup: groupCode.GroupID,
      idMember: userId,
    });

    return groupMember;
  } catch (error) {
    throw new Error(error);
  }
};

const getGroupCodes = async (groupId) => {
  try {
    const groupCodes = await GroupCodes.findAll({
      where: {
        GroupID: groupId,
        IsCodeUsed: false,
      },
    });
    return groupCodes;
  } catch (error) {
    throw new Error(error);
  }
};

const removeGroupCode = async (groupCodeId) => {
  try {
    const groupCode = await GroupCodes.destroy({
      where: { idGroupCodes: groupCodeId },
    });
    return groupCode;
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  generateGroupCode,
  addMemberByGroupCode,
  getGroupCodes,
  removeGroupCode,
};
