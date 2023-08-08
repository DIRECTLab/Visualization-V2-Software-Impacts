const Sequelize = require('sequelize');

const modelName = 'GustavKlein';
module.exports = sequelize => ({
    modelName,
    associate: ({}) => {},
    model: sequelize
        .define(modelName, {
            measuredPower: {type: Sequelize.FLOAT},
            measuredVoltage: {type: Sequelize.FLOAT},
            measuredAmp: {type: Sequelize.FLOAT},

        },
        {
            freezeTableName: true,
            tableName: 'gustavKlein',
        }),
});