const Sequelize = require("sequelize");

const modelName = 'Voltage';
module.exports = sequelize => ({
  modelName,
  associate: ({ Viricitibus, Voltage }) => {
      Voltage.belongsTo(Viricitibus);
  },
  model: sequelize
    .define(modelName, {
      time: { type: Sequelize.DATE, allowNull: false, primaryKey: true },
      value: { type: Sequelize.FLOAT, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'voltage',
    }),
});
