const Sequelize = require("sequelize");

const modelName = "Speed";
module.exports = sequelize => ({
  modelName,
  associate: ({ Viricitibus, Speed }) => {
    Speed.belongsTo(Viricitibus);
  },
  model: sequelize
    .define(modelName, {
      time: { type: Sequelize.DATE, allowNull: false, primaryKey: true },
      value: { type: Sequelize.FLOAT, allowNull: false },
    },
    {
      freezeTableName: true,
      tableName: 'speed',
    }),
});
