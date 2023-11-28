const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");

const CourseOffering = sequelize.define(
  "courseOffering",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    semester_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    class_code:{
        type: DataTypes.STRING,
        allowNull: false,
    }
  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

// // Course & User ( Many -> Many )
// Course.belongsToMany(User, { through: CourseOffering });
// User.belongsToMany(Course, { through: CourseOffering });



module.exports = CourseOffering;
