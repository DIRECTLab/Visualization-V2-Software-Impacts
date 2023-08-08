const Sequelize = require("sequelize");

const modelName = 'EnergyUsedPerDay';
module.exports = sequelize => ({
  modelName,
  associate: ({ Viricitibus, EnergyUsedPerDay }) => {
    EnergyUsedPerDay.belongsTo(Viricitibus);
  },
  model: sequelize
    .define(modelName, {
      time: { type: Sequelize.DATE, allowNull: false, primaryKey: true },
      value: { type: Sequelize.FLOAT, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'energyUsedPerDay',
    }),
});
