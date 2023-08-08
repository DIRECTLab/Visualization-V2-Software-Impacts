const Sequelize = require("sequelize");

const modelName = 'Soc';
module.exports = sequelize => ({
  modelName,
  associate: ({Viricitibus, Soc }) => {
    Soc.belongsTo(Viricitibus);
  },
  model: sequelize
    .define(modelName, {
      time: { type: Sequelize.DATE, allowNull: false, primaryKey: true },
      value: { type: Sequelize.FLOAT, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'soc',
      }),
});