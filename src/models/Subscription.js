const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Subscription = sequelize.define(
  "Subscription",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Current status of the subscription (e.g., active, inactive).
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ['active', 'inactive'],
      defaultValue:'inactive',

    },
    remainingQuestions: {
      type: DataTypes.INTEGER, // Number of questions can be grad
      allowNull: false,
    },
    remainingExams: {
      type: DataTypes.INTEGER, // Number of exams can be graded
      allowNull: false,
    },
    remainingAssignments: {
      type: DataTypes.INTEGER, // Number of assignments can be graded
      allowNull: false,
    },
    
  },
  {
    // hooks: {
    //   beforeCreate: (subscription, options) => {
    //     // Calculate the endDate based on your logic
    //     const endDate = new Date(subscription.startDate);
    //     endDate.setMonth(endDate.getMonth() + 1); // For example, add one month
    //     subscription.endDate = endDate;

    //     // Set the initial status based on the endDate
    //     subscription.status = endDate > new Date() ? 'active' : 'inactive';
    //   },
    //   beforeUpdate: (subscription, options) => {
    //     // Update the status based on the endDate
    //     subscription.status = subscription.endDate > new Date() ? 'active' : 'inactive';
    //   },
    // },
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
  },

);

// Subscription.associate = models => {
//     Subscription.belongsTo(models.User, { foreignKey: 'userId' });
//     Subscription.belongsTo(models.Plan, { foreignKey: 'planId' });
//     Subscription.hasMany(models.Payment, { foreignKey: 'subscriptionId' });

//   };

module.exports = Subscription;
