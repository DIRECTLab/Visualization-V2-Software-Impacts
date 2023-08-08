const Sequelize = require('sequelize');

const modelName = 'Location';
module.exports = sequelize => ({
  modelName,
  associate: ({ Charger, Location }) => {
    Location.hasMany(Charger);
  },
  model: sequelize
    .define(modelName, {
      name: { type: Sequelize.STRING(100), allowNull: false, defaultValue: 'Un-named location' },
      siteId: { type: Sequelize.STRING(50) }
    },
      {
        freezeTableName: true,
        tableName: 'location'
      })
});
