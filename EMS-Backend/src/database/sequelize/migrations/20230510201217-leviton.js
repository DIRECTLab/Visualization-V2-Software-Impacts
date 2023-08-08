'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('levitonEntry', {
      timestamp: { type: Sequelize.DATE, allowNull: false, primaryKey: true, unique: true },
      power: { type: Sequelize.FLOAT, allowNull: false },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }

    });


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('levitonEntry');
  }
};
