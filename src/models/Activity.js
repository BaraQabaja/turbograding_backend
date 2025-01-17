const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Activity = sequelize.define(
  "Activity",
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
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

// // User & Activity (One -> Many)
// User.hasMany(Activity)
// Activity.belongsTo(User);
module.exports = Activity;
