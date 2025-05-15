const salaryroute = require("express").Router();
const express = require('express');

const salaryCrt = require("../../controller/financial/salaryCrt");

salaryroute
  .route("/api/empsallary")
  .post(salaryCrt.create_sallary)
  .get(salaryCrt.get_Sallary);

  salaryroute.route("/api/empsallary")
.delete(salaryCrt.delete_Sallary);

salaryroute.route("/api/empsallary/:_id")
.put(salaryCrt.edit_Sallary);


module.exports = salaryroute;
