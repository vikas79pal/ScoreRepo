'use strict';

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME     || 'gems_cricket',
  process.env.DB_USER     || 'root',
  process.env.DB_PASSWORD || '',
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    timezone: '+00:00',
    logging:  false,
    define: {
      underscored:  true,
      freezeTableName: true,
    },
  },
);

const testConnection = async () => {
  await sequelize.authenticate();
  console.log('MySQL connected successfully');
};

module.exports = { sequelize, testConnection };
