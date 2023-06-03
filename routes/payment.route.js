const express = require('express');
const routes = express.Router();

const pay = require('../controller/payment.controller')



routes.post('/App/api/v1/payment',pay.createOrder);


module.exports = {paymentRoutes : routes}