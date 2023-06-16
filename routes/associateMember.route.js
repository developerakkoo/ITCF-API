const express = require('express');
const routes = express.Router();
const associateMemberController = require('../controller/associateMember.controller');
const Upload = require('../middleware/upload');
const Validate = require('../middleware/associateMember.middleware')

routes.post('/post/associateMember',Validate.associateMember,associateMemberController.postAssociateMember);

routes.post('/associateMember/login',associateMemberController.postLogin);

routes.put('/associateMember/upload/pan/:id',Upload.single("file"),associateMemberController.uploadPan);

routes.put('/associateMember/upload/Adhar/:id',Upload.single("file"),associateMemberController.uploadAdhar);

routes.put('/associateMember/upload/ITR/:id',Upload.single("file"),associateMemberController.uploadITR);

routes.put('/associateMember/upload/ResidentialProof/:id',Upload.single("file"),associateMemberController.uploadResidentialProof);

routes.get('/getById/associateMember/:associateMemberId',associateMemberController.getAssociateMemberById)

routes.get('/associateMember/search',associateMemberController.AssociateMemberSearchOption);

routes.put('/update/associateMember/:associateMemberId',associateMemberController.UpdateAssociateMember);

routes.get('/getAll/associateMember',associateMemberController.getAllAssociateMember);

routes.delete('/delete/associateMember/:associateMemberId',associateMemberController.DeleteAssociateMember);

routes.get('/totalAssociateMember',associateMemberController.totalAssociateMember);

routes.get('/getAll/AssociateMember/notification/:userID',associateMemberController.getAllAssociateMemberNotification);

routes.get('/get/AssociateMember/notification/:userID/:msgID',associateMemberController.getAssociateMemberNotification);

routes.delete('/delete/AssociateMember/notification/:userID/:msgID',associateMemberController.deleteAssociateMemberNotification);

routes.get('/totalAssociateMemberReport',associateMemberController.totalAssociateMemberReport);


routes.get('/App/api/v1/subjectMatterExpert-forgot-password',(req,res,next)=>{
    res.render('forgot-password');
});

routes.post('/App/api/v1/subjectMatterExpert-forgot-password',associateMemberController.forgotPassword);

routes.get('/subjectMatterExpert/rest-password/:id/:token',associateMemberController.getResetPassword);

routes.post('/subjectMatterExpert/rest-password/:id/:token',associateMemberController.ResetPassword);


module.exports = {associateMemberRoutes : routes}

