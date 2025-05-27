import GroupCodes from "../models/groupCodes.js";

const isCodeValid = async (code) => {
  if (!code) {
    throw new Error("Код группы не указан.");
  }

  const codeIsValid = await GroupCodes.findOne({ where: { code } });

  if (!codeIsValid) {
    throw new Error("Некорректный код.");
  }

  return code;
};

export default {
  isCodeValid,
};
