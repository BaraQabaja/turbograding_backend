const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const UserActivities = sequelize.define(
  "UserActivities",
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
      
    },
    activityType: {
        type: DataTypes.STRING,
        allowNull: false,
        values: ["exam","assignment", "question"], 
        defaultValue: "question",
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
  },
  {
    createdAt:true,
  
    // Add updatedAt if you want to track the update time
    updatedAt:true,
  }
  
);

// Plan.associate = (models) => {
//   Plan.hasMany(models.Subscription, { foreignKey: "planId" });
// };
module.exports = UserActivities;
