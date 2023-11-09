const { DataTypes } = require('sequelize');
const sequelize = require('./database');


const Subscription = sequelize.define('Subscription', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    // Current status of the subscription (e.g., active, cancelled).
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    }

}, {
    // Other model options go here
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

// Subscription.associate = models => {
//     Subscription.belongsTo(models.User, { foreignKey: 'userId' });
//     Subscription.belongsTo(models.Plan, { foreignKey: 'planId' });
//     Subscription.hasMany(models.Payment, { foreignKey: 'subscriptionId' });

//   };



module.exports = Subscription;
