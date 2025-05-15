const express = require('express');
const incomeroutes = express.Router();
const controller = require('../../controller/financial/incomeCrt');

// Income categories routes
incomeroutes.route('/api/income-categories')
  .post(controller.create_Categories)
  .get(controller.get_Categories);

// Income transaction routes
incomeroutes.route('/api/income-transaction')
  .post(controller.create_Transaction)
  .get(controller.get_Transaction);

// Income transaction by ID
incomeroutes.route('/api/income-transaction/:id')
  .put(controller.edit_Transaction)
  .delete(controller.delete_Transaction);

// Income labels route
incomeroutes.route('/api/income-labels')
  .get(controller.get_Labels);

module.exports = incomeroutes;