const Sequelize = require('sequelize');

const modelName = 'Fronius';
module.exports = sequelize => ({
  modelName,
  associate: ({ }) => { },
  model: sequelize
    .define(modelName, {
      model: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      acTotalCurrent: { type: Sequelize.FLOAT },
      acPhaseACurrent: { type: Sequelize.FLOAT },
      acPhaseBCurrent: { type: Sequelize.FLOAT },
      acPhaseCCurrent: { type: Sequelize.FLOAT },
      acAbVoltage: { type: Sequelize.FLOAT },
      acBcVoltage: { type: Sequelize.FLOAT },
      acCaVoltage: { type: Sequelize.FLOAT },
      acAnVoltage: { type: Sequelize.FLOAT },
      acBnVoltage: { type: Sequelize.FLOAT },
      acCnVoltage: { type: Sequelize.FLOAT },
      acPower: { type: Sequelize.FLOAT },
      acFrequency: { type: Sequelize.FLOAT },
      apparentPower: { type: Sequelize.FLOAT },
      reactivePower: { type: Sequelize.FLOAT },
      powerFactor: { type: Sequelize.FLOAT },
      acLifetime: { type: Sequelize.FLOAT },
      dcCurrent: { type: Sequelize.FLOAT },
      dcVoltage: { type: Sequelize.FLOAT },
      dcPower: { type: Sequelize.FLOAT },
      flags: { type: Sequelize.STRING.BINARY },
    },
      {
        freezeTableName: true,
        tableName: 'fronius',
      }),
});