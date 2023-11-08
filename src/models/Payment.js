const { DataTypes } = require("sequelize");
const sequelize = require("./database");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Payment status (e.g., pending, completed, failed).
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxPrice:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    totalPrice:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    paymentMethodType:{
        type: DataTypes.STRING,
        values: ['cart ', 'cash '],
        defaultValue:'cash',
        allowNull: false,
    },

  },
  {
    // Other model options go here
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);
// Payment.associate = (models) => {
//   Payment.belongsTo(models.Subscription, { foreignKey: "subscriptionId" });
// };
module.exports = Payment;
