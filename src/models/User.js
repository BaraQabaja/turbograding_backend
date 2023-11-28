const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("./database");
const UserUniversity=require("./UserUniversity")
const University=require("./University")

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

    role: {
      type: DataTypes.STRING, //(e.g., admin, educator, student).
      allowNull: false,
      values: ["admin ", "educator ", "student"],
      defaultValue: "student",
    },
    stripeCustomerId:{//user id in stripe, stripe give each customer a unique id
      type:DataTypes.STRING,
      allowNull:false,
      unique: true

    },
    img: {
      type: DataTypes.TEXT,
      defaultValue: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg/v1/fill/w_300,h_300,q_75,strp/default_user_icon_4_by_karmaanddestiny_de7834s-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzAwIiwicGF0aCI6IlwvZlwvMjcxZGVlYTgtZTI4Yy00MWEzLWFhZjUtMjkxM2Y1ZjQ4YmU2XC9kZTc4MzRzLTY1MTViZDQwLThiMmMtNGRjNi1hODQzLTVhYzFhOTVhOGI1NS5qcGciLCJ3aWR0aCI6Ijw9MzAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.W7L0Rf_YqFzX9yxDfKtIMFnnRFdjwCHxi7xeIISAHNM",
      allowNull:false,

    },
  },
  {
    // Other model options go here
    createdAt: true, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

// // User & University (Many -> Many) 
// User.belongsToMany(University,{through:UserUniversity})
// University.belongsToMany(User,{through:UserUniversity})


module.exports = User;
