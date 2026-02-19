'use strict';

const User  = require('./user.model');
const Otp   = require('./otp.model');
const Score = require('./score.model');

// a user can have many scores
User.hasMany(Score, { foreignKey: 'userId', onDelete: 'CASCADE' });
Score.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Otp, Score };
