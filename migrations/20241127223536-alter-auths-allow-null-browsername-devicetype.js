'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('auths', 'browserName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.changeColumn('auths', 'deviceType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('auths', 'browserName', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('auths', 'deviceType', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};
