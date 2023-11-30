const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");
// const University=require("./University")

const Student = sequelize.define(
  "student",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      // autoIncrement: true,
      primaryKey:true,
      allowNull: false,
    },
    universityID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    fist_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
    // Add a unique constraint for the composite primary key
    indexes: [
      {
        unique: true,
        fields: ['studentID', 'universityID'],
      },
    ],
    
  }
);
// // University & Student (One -> Many)
// University.hasMany(Student)
// Student.belongsTo(University);


module.exports = Student;
