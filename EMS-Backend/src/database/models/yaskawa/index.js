const Sequelize = require('sequelize');

const modelName = 'Yaskawa';
module.exports = sequelize => ({
    modelName,
    associate: ({}) => {},
    model: sequelize
        .define(modelName, {
            status: {type: Sequelize.STRING},
            dailyEnergy: {type: Sequelize.FLOAT},
            lifetimeEnergy: {type: Sequelize.FLOAT},
            powerModuleHeatsinkTemperature: {type: Sequelize.FLOAT},
            internalInverterTemperature: {type: Sequelize.FLOAT},
            activeAcPower: {type: Sequelize.FLOAT},
            apparentAcPower: {type: Sequelize.FLOAT},
            gridVoltageUab: {type: Sequelize.FLOAT},
            gridVoltageUbc: {type: Sequelize.FLOAT},
            gridVoltageUca: {type: Sequelize.FLOAT},
            gridACurrent: {type: Sequelize.FLOAT},
            gridBCurrent: {type: Sequelize.FLOAT},
            gridCCurrent: {type: Sequelize.FLOAT},
            dcVoltageMPPTZone1: {type: Sequelize.FLOAT},
            dcCurrentMPPTZone1: {type: Sequelize.FLOAT},
            dcVoltageMPPTZone2: {type: Sequelize.FLOAT},
            dcCurrentMPPTZone2: {type: Sequelize.FLOAT},
            gridFrequency: {type: Sequelize.FLOAT},
            register0x34: {type: Sequelize.STRING},
            register0x35: {type: Sequelize.STRING},
            register0x36: {type: Sequelize.STRING},
            register0x37: {type: Sequelize.STRING},
            register0x38: {type: Sequelize.STRING},
            register0x39: {type: Sequelize.STRING},
            register0x3a: {type: Sequelize.STRING},
        },
        {
            freezeTableName: true,
            tableName: 'yaskawa',
        }),
});