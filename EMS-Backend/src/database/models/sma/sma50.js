const Sequelize = require('sequelize');

const modelName = 'Sma50';
module.exports = sequelize => ({
    modelName,
    associate: ({}) => {},
    model: sequelize
      .define(modelName, {
        status: {type: Sequelize.STRING},
        acLifetime: {type: Sequelize.FLOAT},
        acPower: {type: Sequelize.FLOAT},
        acAnVoltage: {type: Sequelize.FLOAT},
        acBnVoltage: {type: Sequelize.FLOAT},
        acCnVoltage: {type: Sequelize.FLOAT},
        acAbVoltage: {type: Sequelize.FLOAT},
        acBcVoltage: {type: Sequelize.FLOAT},
        acCaVoltage: {type: Sequelize.FLOAT},
        acTotalCurrent: {type: Sequelize.FLOAT},
        acFrequency: {type: Sequelize.FLOAT},
        acPhaseACurrent: {type: Sequelize.FLOAT},
        acPhaseBCurrent: {type: Sequelize.FLOAT},
        acPhaseCCurrent: {type: Sequelize.FLOAT},
        reactivePower: {type: Sequelize.FLOAT},
        apparentPower: {type: Sequelize.FLOAT},
        powerFactor: {type: Sequelize.FLOAT},
        dcCurrent: {type: Sequelize.FLOAT},
        dcVoltage: {type: Sequelize.FLOAT},
        dcPower: {type: Sequelize.FLOAT},        
      },
      {
        freezeTableName: true,
        tableName: 'sma50',
      }),
  });
