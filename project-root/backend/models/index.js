require('dotenv').config();

const { Sequelize } = require('sequelize');
const ProfilePictureModel = require('./ProfilePicture'); // import model factory

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'portfolio_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'stkiit',
  logging: false,
});

// Initialize the model
const ProfilePicture = ProfilePictureModel(sequelize);

// Sync models with DB
sequelize.sync({ alter: true })  // use { force: true } to drop & recreate
  .then(() => {
    console.log('Database synced and tables created!');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = { sequelize, ProfilePicture };