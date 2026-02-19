'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('users', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  phone: {
    type:      DataTypes.STRING(15),
    allowNull: false,
    unique:    true,
  },
  name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },
  dob: {
    type:      DataTypes.DATEONLY,
    allowNull: false,
  },
  email: {
    type:      DataTypes.STRING(255),
    allowNull: false,
    unique:    true,
  },
}, {
  timestamps: true,
});

module.exports = User;
