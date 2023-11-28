const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");

const Course = sequelize.define(
  "course",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    course_code:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    course_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    course_desc:{
        type: DataTypes.STRING,
        allowNull: true,
    }
 
  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);
// Course.belongsTo(University);


module.exports = Course;
