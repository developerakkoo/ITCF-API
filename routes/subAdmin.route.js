const express = require('express');
const routes = express.Router();
const subAdminController = require('../controller/subAdminController');
const Validate = require('../middleware/subAdmin.middleware');



routes.post('/subAdmin/signup',Validate.validateSubAdmin,subAdminController.postSignup);

routes.post('/subAdmin/login',subAdminController.postLogin);

routes.get('/subAdmin/search',subAdminController.subAdminSearchOption);

routes.put('/update/subAdmin/:subAdminId',subAdminController.UpdateSubAdmin);

routes.delete('/delete/subAdmin/:subAdminId',subAdminController.DeleteSubAdmin);

// routes.get('/count/subAdmin',subAdminController);






module.exports = {subAdminRoutes : routes}



//    localhost:8080/