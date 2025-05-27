import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const GroupCodes = sequelize.define('GroupCodes', {
    idGroupCodes: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    GroupID: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false,
        references: {
            model: "Groups",
            key: "idGroups",
        },
    },
    Code: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
    },
    IsCodeUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

export default GroupCodes;