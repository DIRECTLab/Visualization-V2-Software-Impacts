const Sequelize = require('sequelize');

const modelName = 'Sma7';
module.exports = sequelize => ({
    modelName,
    associate: ({}) => {},
    model: sequelize
      .define(modelName, {
        status: {type: Sequelize.STRING},
        acLifetime: {type: Sequelize.FLOAT},
        acPower: {type: Sequelize.FLOAT},
        acAnVoltage: {type: Sequelize.FLOAT},
        acTotalCurrent: {type: Sequelize.FLOAT},
        acFrequency: {type: Sequelize.FLOAT},
        acPhaseACurrent: {type: Sequelize.FLOAT},
        reactivePower: {type: Sequelize.FLOAT},
        apparentPower: {type: Sequelize.FLOAT},
        powerFactor: {type: Sequelize.FLOAT},
        dcCurrent: {type: Sequelize.FLOAT},
        dcVoltage: {type: Sequelize.FLOAT},
        dcPower: {type: Sequelize.FLOAT},     
            
            
      },
      {
        freezeTableName: true,
        tableName: 'sma7',
      }),
  });