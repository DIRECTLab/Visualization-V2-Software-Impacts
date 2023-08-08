const Sequelize = require("sequelize");

const modelName = 'Odo';
module.exports = sequelize => ({
  modelName,
  associate: ({ Viricitibus, Odo }) => {
    Odo.belongsTo(Viricitibus);
  },
  model: sequelize
    .define(modelName, {
      time: { type: Sequelize.DATE, allowNull: false, primaryKey: true },
      value: { type: Sequelize.FLOAT, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'odo',
    }),
});
