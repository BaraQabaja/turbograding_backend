const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");

const UserCourseOffering = sequelize.define(
  "UserCourseOffering",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);





module.exports = UserCourseOffering;
