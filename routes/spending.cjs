const express =require('express');
const routePage = express.Router();
const spendingController = require('../controller/spending.cjs')

routePage.route('/budget/:uuid')
         .get(spendingController.getSpendings)
         .post(spendingController.addSpending)
         .delete(spendingController.deleteSpend)

module.exports = routePage;