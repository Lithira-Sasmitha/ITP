const incomeroutes = require('income').Router();
const controller = require('../../controller/financial/incomeCrt');
const { default: route } = require('./const');

// Income categories routes
incomeroutes.route(route.income.apiIncome)
  .post(controller.create_Categories)
  .get(controller.get_Categories)

// Income transaction routes
incomeroutes.route(route.income.apiTransaction)
  .post(controller.create_Transaction)
  .get(controller.get_Transaction)
  .delete(controller.delete_Transaction)
  .put(controller.edit_Transaction);

// Income transaction by ID
incomeroutes.route('/api/income-transaction/:id')
  .put(controller.edit_Transaction)
  .delete(controller.delete_Transaction);

// Income labels route
incomeroutes.route('/api/income-labels')
  .get(controller.get_Labels)

module.exports = incomeroutes;