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
const dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  }
};

const defaultOptions = { dialect, logging: false };

const sequelize = process.env.DATABASE_URL ?
  // 本番環境
  new Sequelize(process.env.DATABASE_URL, {
    ...defaultOptions, dialectOptions
  }) :
  // 開発環境
  new Sequelize(database, username, password, {
    ...defaultOptions, host
  });

module.exports = { sequelize, DataTypes };
