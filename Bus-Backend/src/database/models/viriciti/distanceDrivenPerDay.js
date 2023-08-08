const Sequelize = require("sequelize");

const modelName = 'DistanceDrivenPerDay';
module.exports = sequelize => ({
  modelName,
  associate: ({ Viricitibus, DistanceDrivenPerDay }) => {
    DistanceDrivenPerDay.belongsTo(Viricitibus);
  },
  model: sequelize
    .define(modelName, {
      time: { type: Sequelize.DATE, allowNull: false, primaryKey: true },
      value: { type: Sequelize.FLOAT, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'distanceDrivenPerDay',
    }),
});
