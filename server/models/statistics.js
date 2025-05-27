import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Statistics = sequelize.define(
  "Statistics",
  {
    idStatistics: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    MoveID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "OpeningMoves",
        key: "idOpeningMoves",
      },
    },
    IsMoveCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    UserID: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Users",
        key: "idUsers",
      },
    },
    TimeToThink: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

export default Statistics;
