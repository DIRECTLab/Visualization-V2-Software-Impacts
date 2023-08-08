const Sequelize = require("sequelize");

const modelName = 'Current';
module.exports = sequelize => ({
    modelName,
    associate: ({ Viricitibus, Current }) => {
        Current.belongsTo(Viricitibus);
    },
    model: sequelize
        .define(modelName, {
            time: { type: Sequelize.DATE, allowNull: false, primaryKey: true },
            value: { type: Sequelize.FLOAT, allowNull: false },
        },
        {
            freezeTableName: true,
            tableName: 'current',
        }),
});
