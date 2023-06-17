const express = require('express');
const routes = express.Router();
const TeamAdminController = require('../controller/TeamAdmin.controller')
const Validate = require('../middleware/TeamAdmin.middleware') 



routes.post('/App/api/v1/signUp',[Validate.validateTeamAdmin],TeamAdminController.signUp);

routes.delete('/teamAdmin/deletePlayer/team/:TeamAdminId/:TeamId',TeamAdminController.deletePlayerFromTeam);

routes.post('/TeamAdmin/bulkCreate/:TeamAdminId/:TeamId',TeamAdminController.PlayerBulkCreate);

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

routes.post('/add/player/:TeamAdminId/:TeamId',TeamAdminController.PlayerCreate);





routes.get('/App/api/v1/TeamAdmin-forgot-password',(req,res,next)=>{
    res.render('forgot-password');
});

routes.post('/App/api/v1/TeamAdmin-forgot-password',TeamAdminController.forgotPassword);

routes.get('/rest-password/:id/:token',TeamAdminController.getResetPassword);

routes.post('/rest-password/:id/:token',TeamAdminController.ResetPassword);



routes.get('/App/api/v1/TeamAdmin-forgot-UID',(req,res,next)=>{
    res.render('forgot-UID.ejs');
});

routes.post('/App/api/v1/TeamAdmin-forgot-UID',TeamAdminController.forgotUID);

routes.get('/TeamAdmin-rest-UID/:id/:token',TeamAdminController.getResetUID);

routes.post('/TeamAdmin-rest-UID/:id/:token',TeamAdminController.ResetUID);


module.exports = {TeamAdminRoutes : routes}