const express = require('express');
const route = express.Router();
const ReqController = require('../controller/reqToProPlayer');

route.get('/getAll/request',ReqController.getAllRequest);

route.get('/get/request/:reqId',ReqController.getRequestById);

route.get('/get/request-By-user/:userId',ReqController.getRequestByUserId);

route.delete('/delete/request/:reqId',ReqController.deleteRequest);


module.exports = {RqsToProMemberRoutes : route}