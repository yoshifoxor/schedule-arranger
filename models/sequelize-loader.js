'use strict';
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const { database, dialect, host, username, password } = {
  database: 'schedule_arranger',
  dialect: 'postgres',
  host: process.env.POSTGRES_HOST,
  username: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
};

const sequelize = new Sequelize(database, username, password, {
  dialect: dialect,
  host: host,
});

module.exports = { sequelize, DataTypes };
