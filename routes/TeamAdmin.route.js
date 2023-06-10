const express = require('express');
const routes = express.Router();
const TeamAdminController = require('../controller/TeamAdmin.controller')
const Validate = require('../middleware/TeamAdmin.middleware') 



routes.post('/App/api/v1/signUp',[Validate.validateTeamAdmin],TeamAdminController.signUp);

routes.put('/teamAdmin/addPlayer/team/:TeamAdminId/:TeamId',TeamAdminController.addPlayerToTeam);

routes.post('/TeamAdmin/bulkCreate/:Id',TeamAdminController.PlayerBulkCreate);

routes.post('/App/api/v1/auth/signIn',[Validate.validateTeamAdminSignIn],TeamAdminController.signIn);

routes.put('/update/teamAdmin/:teamAdID',TeamAdminController.UpdateTeamAdmin);

routes.get('/getAll/teamAdmin',TeamAdminController.getAllTeamAdmin);

routes.get('/teamAdmin/search',TeamAdminController.teamAdminSearchOption);

routes.get('/getById/teamAdmin/:Id',TeamAdminController.getTeamAdminById);

routes.get('/getByUid/teamAdmin/:Id',TeamAdminController.getTeamAdminByUid);

routes.delete('/delete/teamAdmin/:teamAdID',TeamAdminController.DeleteTeamAdmin);

routes.get('/getAll/teamAdmin/notification/:userID',TeamAdminController.getAllTeamAdminNotification);

routes.get('/get/teamAdmin/notification/:userID/:msgID',TeamAdminController.getTeamAdminNotification);

routes.delete('/delete/teamAdmin/notification/:userID/:msgID',TeamAdminController.deleteTeamAdminNotification);







routes.get('/App/api/v1/TeamAdmin-forgot-password',(req,res,next)=>{
    res.render('forgot-password');
});

routes.post('/App/api/v1/TeamAdmin-forgot-password',TeamAdminController.forgotPassword);

routes.get('/rest-password/:id/:token',TeamAdminController.getResetPassword);

routes.post('/rest-password/:id/:token',TeamAdminController.ResetPassword);






module.exports = {TeamAdminRoutes : routes}