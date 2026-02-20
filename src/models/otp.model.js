'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Otp = sequelize.define('otps', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  phone: {
    type:      DataTypes.STRING(15),
    allowNull: false,
  },
  otp: {
    type:      DataTypes.STRING(10),
    allowNull: false,
  },
  expiresAt: {
    type:      DataTypes.DATE,
    allowNull: false,
  },
  isUsed: {
    type:         DataTypes.BOOLEAN,
    allowNull:    false,
    defaultValue: false,
  },
}, {
  timestamps:  true,
  updatedAt:   false,  
});

module.exports = Otp;
