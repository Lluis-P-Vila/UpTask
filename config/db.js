const Sequelize = require('sequelize');

//Extreure valors de variables tipus .env
require('dotenv').config({path: 'variables.env'})


// Option 1: Passing parameters separately
const db = new Sequelize(
  process.env.BD_NOMBRE, 
  process.env.BD_USER, 
  process.env.BD_PASSWORD, 
  {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    port: process.env.BD_PORT, 
    define: {
        timestamps: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = db; 