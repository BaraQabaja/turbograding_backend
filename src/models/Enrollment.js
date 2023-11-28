const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");
const Student = require("./Student");
const CourseOffering = require("./CourseOffering");

const Enrollment = sequelize.define(
  "enrollment",
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
// // CourseOffering & Student ( Many -> Many )
// Student.belongsToMany(CourseOffering, { through: Enrollment });
// CourseOffering.belongsToMany(Student, { through: Enrollment });



module.exports = Enrollment;
