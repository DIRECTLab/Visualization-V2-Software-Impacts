const Sequelize = require("sequelize");

const modelName = 'Gps';
module.exports = sequelize => ({
  modelName,
  associate: ({ Viricitibus, Gps }) => {
    Gps.belongsTo(Viricitibus);
  },
  model: sequelize
    .define(modelName, {
      time: { type: Sequelize.DATE, allowNull: false, primaryKey: true },
      lat: { type: Sequelize.FLOAT, allowNull: false },
      long: { type: Sequelize.FLOAT, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'gps',
    }),
});
