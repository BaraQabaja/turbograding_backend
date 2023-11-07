const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('./database');

const User = sequelize.define('users', {
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING, //(e.g., admin, educator, student).
        allowNull: false
    }
 
}, {
    // Other model options go here
    createdAt: false, // disable createdAt
    updatedAt: false // disable updatedAt
});

//The User.beforeCreate hook hashes the password before a new user is created.
User.beforeCreate(async (user, options) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
});

//The validPassword function is an instance method added to the User model. It uses bcrypt.compare to check whether the given password matches the hashed password for the user.
User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = User;
