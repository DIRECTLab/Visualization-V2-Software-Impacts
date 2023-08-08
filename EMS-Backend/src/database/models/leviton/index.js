const Sequelize = require('sequelize');

const modelName = 'LevitonEntry';
module.exports = sequelize => ({
    modelName,
    associate: () => {
    },

    model: sequelize
        .define(modelName, {
            timestamp: { type: Sequelize.DATE, allowNull: false, primaryKey: true, unique: true },
            power: { type: Sequelize.FLOAT, allowNull: false },
        },
        {
            freezeTableName: true,
            tableName: 'levitonEntry',
        }),
});