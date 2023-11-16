const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const UserActivities = sequelize.define(
  "userActivities",
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    activityType: {
        type: DataTypes.STRING,
        allowNull: false,
        values: ["basic","premium", "professional"], //
        defaultValue: "basic",//
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
  },
  {
    // Other model options go here
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
  
);

// Plan.associate = (models) => {
//   Plan.hasMany(models.Subscription, { foreignKey: "planId" });
// };
module.exports = UserActivities;
