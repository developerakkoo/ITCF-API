const express = require('express');
const routes = express.Router();
const TeamAdminController = require('../controller/TeamAdmin.controller')
const Validate = require('../middleware/TeamAdmin.middleware') 



routes.post('/App/api/v1/signUp',[Validate.validateTeamAdmin],TeamAdminController.signUp);

routes.post('/App/api/v1/auth/signIn',[Validate.validateTeamAdminSignIn],TeamAdminController.signIn);

routes.put('/update/teamAdmin/:Id',TeamAdminController.UpdateTeamAdmin);

routes.get('/getAll/teamAdmin',TeamAdminController.getAllTeamAdmin);

routes.get('/teamAdmin/search',TeamAdminController.teamAdminSearchOption);

routes.get('/getById/teamAdmin/:Id',TeamAdminController.getTeamAdminById);

routes.get('/getByUid/teamAdmin/:Id',TeamAdminController.getTeamAdminByUid);

routes.delete('/delete/teamAdmin/:Id',TeamAdminController.DeleteTeamAdmin);

routes.get('/totalTeamAdmin',TeamAdminController.totalTeamAdmin);

routes.get('/totalTeamAdminReport',TeamAdminController.totalTeamAdminReport);



routes.get('/App/api/v1/TeamAdmin-forgot-password',(req,res,next)=>{
    res.render('forgot-password');
});

routes.post('/App/api/v1/TeamAdmin-forgot-password',TeamAdminController.forgotPassword);

routes.get('/rest-password/:id/:token',TeamAdminController.getResetPassword);

routes.post('/rest-password/:id/:token',TeamAdminController.ResetPassword);






module.exports = {TeamAdminRoutes : routes}