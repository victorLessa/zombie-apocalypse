'use strict';

const tableName = 'items'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(tableName, [{
      name: 'Water',
      points: 4
    },{
      name: 'Food',
      points: 3
    },
    {
      name: 'Medication',
      points: 2
    },
    {
      name: 'Ammunition',
      points: 1
    }]);
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(tableName, null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
  }
};
