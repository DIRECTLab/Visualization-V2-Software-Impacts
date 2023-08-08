const Sequelize = require('sequelize');

const modelName = 'User';
module.exports = sequelize => ({
    modelName,
    associate: () => {
    },
    model: sequelize
        .define(modelName, {
            id: { type: Sequelize.INTEGER, allowNull: false, primaryKey: true, unique: true, autoIncrement: true },
            username: { type: Sequelize.STRING, allowNull: false, unique: true },
            password: { type: Sequelize.STRING, allowNull: false },
            firstName: { type: Sequelize.STRING, allowNull: false },
            lastName: { type: Sequelize.STRING },
        },
        {
            freezeTableName: true,
            tableName: 'user',
        }),
});