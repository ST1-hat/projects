const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const About = sequelize.define('About', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    overview: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hobbies: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    speciality: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    education: {
      type: DataTypes.JSON, // Store education as JSON array
      allowNull: true,
    },
  }, {
    tableName: 'abouts',
    timestamps: true,
  });

  return About;
};
