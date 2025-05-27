import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const GroupMembers = sequelize.define("GroupMembers", {
  idGroup: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    references: {
      model: "Groups",
      key: "idGroups",
    },
  },
  idMember: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
    references: {
      model: "Users",
      key: "idUsers",
    },
  },
});

export default GroupMembers;
