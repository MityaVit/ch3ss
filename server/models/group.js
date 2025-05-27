import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Groups = sequelize.define("Groups", {
  idGroups: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  GroupName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  MaxMembers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  OwnerID: {
    type: DataTypes.UUID,
    unique: false,
    allowNull: false,
  },
  GroupOpening: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: false,
    references: {
      model: "Openings",
      key: "idOpenings",
    },
  },
});

export default Groups;
