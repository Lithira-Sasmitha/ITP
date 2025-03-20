const routes = require('express').Router();
const controller = require('../../controller/financial/incomeCrt');


incomeroute
  .route("/api/income")
  .post(controller.create_Income)
  .get(controller.get_income)
  .delete(controller.delete_income);
incomeroute.route("/api/income/:_id")
    .put(controller.edit_income);

incomeroute
  .route("/api/incomecategories")
  .post(controller.create_incomeCategories)
  .get(controller.get_incomeCategories);

incomeroute
  .route("/api/labels") 
  .get(controller.get_Labels);

  module.exports = incomeroute;   