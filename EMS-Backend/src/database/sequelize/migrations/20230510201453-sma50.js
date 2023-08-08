'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("sma50", {
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
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("sma50");
  }
};
