const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");
const User=require("./User")
const University=require("./University")

const UserUniversity = sequelize.define(
  "userUniversity",
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

// UserUniversity.belongsTo(User);
// UserUniversity.belongsTo(University);

module.exports = UserUniversity;
