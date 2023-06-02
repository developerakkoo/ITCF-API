const express = require('express');
const routes = express.Router();
const associateMemberController = require('../controller/associateMember.controller');
const Upload = require('../middleware/upload');
const Validate = require('../middleware/associateMember.middleware')

routes.post('/post/associateMember',Upload.fields([{name:'PANCard',maxCount: 1},{name:'ADHARCard',maxCount: 1},{name:'residentialProof',maxCount: 1},{name:'ITR',maxCount: 1}]),Validate.associateMember,associateMemberController.postAssociateMember);

routes.get('/associateMember/search',associateMemberController.AssociateMemberSearchOption);

routes.put('/update/associateMember/:associateMemberId',associateMemberController.UpdateAssociateMember);

routes.get('/getAll/associateMember',associateMemberController.getAllAssociateMember);

routes.delete('/delete/associateMember/:associateMemberId',associateMemberController.DeleteAssociateMember);

routes.get('/totalAssociateMember',associateMemberController.totalAssociateMember);

routes.get('/getAll/AssociateMember/notification/:userID',associateMemberController.getAllAssociateMemberNotification);

routes.get('/get/AssociateMember/notification/:userID/:msgID',associateMemberController.getAssociateMemberNotification);

routes.delete('/delete/AssociateMember/notification/:userID/:msgID',associateMemberController.deleteAssociateMemberNotification);

routes.get('/totalAssociateMemberReport',associateMemberController.totalAssociateMemberReport);


module.exports = {associateMemberRoutes : routes}