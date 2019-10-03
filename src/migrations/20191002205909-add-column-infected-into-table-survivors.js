'use strict';

const tableName = 'survivors'
const columnName = 'infected'

module.exports = {
  up: async (queryInterface, Sequelize) =>
    await queryInterface.addColumn(tableName, columnName, {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
  }),
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(tableName, columnName)
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
