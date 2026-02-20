'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Score = sequelize.define('scores', {
  id: {
    type:          DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey:    true,
  },
  userId: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  score: {
    type:      DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
}, {
  timestamps: true,
  updatedAt:  false,
  createdAt:  'playedAt',   // mapin\g createdAt  played_at column
});

module.exports = Score;
