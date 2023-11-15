const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");

const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      requaired: true, //Bara
      len: [8, 50], //Bara
    }, //Bara
    passwordChangedAt:{
      type: DataTypes.DATE,
    },
    logoutAt: {
      type: DataTypes.DATE,
    }, //Bara
    passwordResetCode: {
      type: DataTypes.STRING,
    }, //Bara
    passwordResetExpire: {
      type: DataTypes.DATE,
    }, //Bara
    passwordResetVerified: {
      type: DataTypes.BOOLEAN,
    }, //Bara
    emailVerificationToken: {
      type: DataTypes.STRING,
    }, //Bara
    verifiedEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },//Bara optional
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },//Bara optional
    country:{
      type:DataTypes.STRING,
      allowNull: true
    },//Bara optional
    city:{
      type:DataTypes.STRING,
      allowNull: true
    },//anything about the user, optional
    about:{
      type:DataTypes.STRING,
      allowNull:true,
    },//Bara 
    joinDate:{
      type: DataTypes.DATE,
      allowNull: false

    },
    role: {
      type: DataTypes.STRING, //(e.g., admin, educator, student).
      allowNull: false,
      values: ["admin ", "educator ", "student"],
      defaultValue: "student",
    },
    stripeCustomerId:{//user id in stripe, stripe give each customer a unique id
      type:DataTypes.STRING,
      allowNull:false,
    }
  },
  {
    // Other model options go here
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

// User.associate = (models) => {
//   console.log("in the user relations")
//   User.hasMany(models.Subscription, { foreignKey: "userId" });
// };

//The User.beforeCreate hook hashes the password before a new user is created.
// User.beforeCreate(async (user, options) => {
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);
// });

//The validPassword function is an instance method added to the User model. It uses bcrypt.compare to check whether the given password matches the hashed password for the user.
// User.prototype.validPassword = async function (password) {
//   return await bcrypt.compare(password, this.password);
// };

module.exports = User;
