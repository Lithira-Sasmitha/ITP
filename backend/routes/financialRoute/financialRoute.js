const routes = require('express').Router();
const controller = require('../controller/financial/incomeCrt');

//  all the income base api request
routes.route('/api/categories')
 .post(controller.create_Categories)
 .get(controller.get_Categories)


 routes.route('/api/transaction')
 .post(controller.create_income)
 .get(controller.get_income)
 .delete(controller.delete_income)
 .put(controller.edit_income); 

 routes.route('/api/transaction/:id')
  .put(controller.edit_income)
  .delete(controller.delete_income);


 routes.route('/api/labels')
 .get(controller.get_Labels)


module.exports = financialRoute;   