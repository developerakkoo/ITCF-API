const express = require('express');
const routes = express.Router();
const subMatterExController = require('../controller/subMatterEx');
const Upload = require('../middleware/upload');
const Validate =require('../middleware/subMatterEx.middleware');


routes.post('/post/subMatterEx',Validate.SubMatterEx,subMatterExController.postSubMatterEx);

routes.put('/post/subMatterEx/Docs/:id',Upload.array('Docs',10),subMatterExController.postSubMatterExDoc);

routes.get('/subMatterEx/search',subMatterExController.subMatterExSearchOption);
routes.get('/subMatterEx/:id',subMatterExController.getSubMatterById);

routes.put('/update/subMatterEx/:subMatterExId',subMatterExController.UpdateSubMatterEx);

routes.get('/getAll/subMatterEx',subMatterExController.getAllSubMatterEx);

routes.delete('/delete/subMatterEx/:subMatterExId',subMatterExController.DeleteSubMatterEx);

routes.get('/getAll/subMatterEx/notification/:userID',subMatterExController.getAllSubMatterExNotification);

routes.get('/get/subMatterEx/notification/:userID/:msgID',subMatterExController.getSubMatterExNotification);

routes.delete('/delete/subMatterEx/notification/:userID/:msgID',subMatterExController.deleteSubMatterExNotification);


routes.post('/subMatterEx/login',subMatterExController.postLogin);


routes.get('/App/api/v1/subjectMatterExpert-forgot-password',(req,res,next)=>{
    res.render('forgot-password');
});

routes.post('/App/api/v1/subjectMatterExpert-forgot-password',subMatterExController.forgotPassword);

routes.get('/subjectMatterExpert/rest-password/:id/:token',subMatterExController.getResetPassword);

routes.post('/subjectMatterExpert/rest-password/:id/:token',subMatterExController.ResetPassword);

module.exports = {subMatterExRoutes : routes}


