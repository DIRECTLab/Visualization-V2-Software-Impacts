const Sequelize = require("sequelize");

const modelName = 'Power';
module.exports = sequelize => ({
  modelName,
  associate: ({ Viricitibus, Power }) => {
    Power.belongsTo(Viricitibus);
  },
  model: sequelize
    .define(modelName, {
      time: { type: Sequelize.DATE, allowNull: false, primaryKey: true },
      value: { type: Sequelize.FLOAT, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'power',
    }),
});
