'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("gustavKlein", {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      measuredPower: {type: Sequelize.FLOAT},
      measuredVoltage: {type: Sequelize.FLOAT},
      measuredAmp: {type: Sequelize.FLOAT},
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("gustavKlein")
  }
};
