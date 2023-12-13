const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Plan = sequelize.define(
  "Plan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ["basic","premium", "professional"], //ex: Basic, Silver, Gold, Premium, Starter, Professional, Enterprise, Family, Student, Business
      defaultValue: "basic",//basic plan is *free* plan
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false, // Allow null or 0 value
      defaultValue: 0.0, // Set default value to 0.0
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER, // Duration in days
      allowNull: false,
    },
    questions: {
      type: DataTypes.INTEGER, // Number of questions can be grad
      allowNull: false,
    },
    exams: {
      type: DataTypes.INTEGER, // Number of exams can be graded
      allowNull: false,
    },
    assignments: {
      type: DataTypes.INTEGER, // Number of assignments can be graded
      allowNull: false,
    },
    priceId: {
      //plan link - including plan price and plan desc ...- in stripe
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      
      type: DataTypes.STRING,
      values: ["active","inactive"],
      allowNull: false,

      defaultValue: "active",
    },
  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
  
);

// Plan.associate = (models) => {
//   Plan.hasMany(models.Subscription, { foreignKey: "planId" });
// };
module.exports = Plan;
