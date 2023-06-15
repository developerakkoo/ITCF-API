const express = require('express');
const routes = express.Router();
const superAdminController = require('../controller/superAdmin.controller');
const TeamAdminController = require('../controller/TeamAdmin.controller');
const associateMemberController = require('../controller/associateMember.controller');
const TeamAController = require('../controller/team.controller');
const playerController = require('../controller/player.controller');
const subMatterExController = require('../controller/subMatterEx');
const subAdminController = require('../controller/subAdminController');
//middleware
const Validate = require('../middleware/superAdmin.middleware');
const validateSubAdmin = require('../middleware/subAdmin.middleware');
const validateTeamAdmin = require('../middleware/TeamAdmin.middleware');
const ValidateAssociateMember = require('../middleware/associateMember.middleware');
const validateTeam = require('../middleware/team.middleware');
const validateSubMatterEx =require('../middleware/subMatterEx.middleware');
const validatePlayer = require('../middleware/player.middleware');
const Upload = require('../middleware/upload');


routes.post('/superAdmin/signup',Validate.validateSuperAdmin,superAdminController.postSignup);

routes.post('/superAdmin/login',superAdminController.postLogin);

routes.post('/superAdmin/notifyUsers/:Id',Validate.isSuperAdmin,superAdminController.sendNotification);

routes.put('/update/superAdmin/:Id',Validate.isSuperAdmin,superAdminController.UpdateSuperAdmin);

routes.delete('/delete/superAdmin/:Id',superAdminController.DeleteSuperAdmin);

routes.delete('/superAdmin/delete/notification/:Id/:notificationId',Validate.isSuperAdmin,superAdminController.deleteNotification);

routes.get('/superAdmin/searchNotification/:Id',Validate.isSuperAdmin,superAdminController.NotificationSearchOption);

routes.put('/superAdmin/update/notification/:Id/:notificationId',Validate.isSuperAdmin,superAdminController.updateNotification);

//teamAdmin operations by superAdmin

routes.post('/superAdmin/teamAdmin/signUp/:Id',[Validate.isSuperAdmin,validateTeamAdmin.validateTeamAdmin],superAdminController.signUpTeamAdmin);

routes.get('/superAdmin/getAll/teamAdmin/:Id',Validate.isSuperAdmin,TeamAdminController.getAllTeamAdmin);

routes.get('/superAdmin/teamAdmin/search/:Id',Validate.isSuperAdmin,TeamAdminController.teamAdminSearchOption);

routes.put('/superAdmin/block/teamAdmin/:Id/:teamAdID',Validate.isSuperAdmin,TeamAdminController.UpdateTeamAdmin);

routes.put('/superAdmin/update/teamAdmin/:Id/:teamAdID',Validate.isSuperAdmin,TeamAdminController.UpdateTeamAdmin);

routes.delete('/superAdmin/delete/teamAdmin/:Id/:teamAdID',Validate.isSuperAdmin,TeamAdminController.DeleteTeamAdmin);

routes.get('/totalTeamAdmin/:Id',Validate.isSuperAdmin,TeamAdminController.totalTeamAdmin);

routes.get('/totalTeamAdminReport/:Id',Validate.isSuperAdmin,TeamAdminController.totalTeamAdminReport);


//Team  operations by super admin


routes.post('/superAdmin/team/:Id',validateTeam.validateTeam,superAdminController.signUpTeam)

routes.put('/superAdmin/update/team/:Id/:teamId',TeamAController.UpdateTeam);

routes.put('/superAdmin/block/team/:Id/:teamId',TeamAController.UpdateTeam);

routes.get('/superAdmin/team/search/:Id',TeamAController.teamSearchOption);

routes.get('/superAdmin/getAll/team/:Id',TeamAController.getAllTeam);

routes.get('/superAdmin/getById/team/:Id',TeamAController.getTeamById);

routes.delete('/superAdmin/delete/team/:Id/:teamId',TeamAController.DeleteTeam);

routes.get('/totalTeamReport/:Id',TeamAController.totalTeamReport);

routes.get('/totalTeam/:Id',TeamAController.totalTeamCount);


//associate member operations by super admin

routes.post('/superAdmin/post/associateMember/:Id',Validate.isSuperAdmin,Upload.fields([{name:'PANCard',maxCount: 1},{name:'ADHARCard',maxCount: 1},{name:'residentialProof',maxCount: 1},{name:'ITR',maxCount: 1}]),ValidateAssociateMember.associateMember,superAdminController.signUpAssociateMember);

routes.get('/superAdmin/associateMember/search/:Id',Validate.isSuperAdmin,associateMemberController.AssociateMemberSearchOption);

routes.put('/add/credential/:Id',Validate.isSuperAdmin,associateMemberController.updatePasswordToAssociateMember)

routes.put('/superAdmin/update/associateMember/:Id/:associateMemberId',Validate.isSuperAdmin,associateMemberController.UpdateAssociateMember);

routes.put('/superAdmin/block/associateMember/:Id/:associateMemberId',Validate.isSuperAdmin,associateMemberController.UpdateAssociateMember);

routes.get('/superAdmin/getAll/associateMember/:Id',Validate.isSuperAdmin,associateMemberController.getAllAssociateMember);

routes.delete('/superAdmin/delete/associateMember/:Id/:associateMemberId',Validate.isSuperAdmin,associateMemberController.DeleteAssociateMember);

routes.get('/superAdmin/totalAssociateMember/:Id',Validate.isSuperAdmin,associateMemberController.totalAssociateMember);

routes.get('/superAdmin/totalAssociateMemberReport/:Id',Validate.isSuperAdmin,associateMemberController.totalAssociateMemberReport);



//subMatterEx  operations by super admin

routes.post('/superAdmin/post/subMatterEx/:Id',Validate.isSuperAdmin,Upload.array('Docs',10),validateSubMatterEx.SubMatterEx,superAdminController.signUpMatterEx);

routes.put('/subMatterEx/add/credential/:Id',Validate.isSuperAdmin,subMatterExController.updatePasswordToSubMatterEx)

routes.get('/superAdmin/subMatterEx/search/:Id',Validate.isSuperAdmin,subMatterExController.subMatterExSearchOption);

routes.put('/superAdmin/update/subMatterEx/:Id/:subMatterExId',Validate.isSuperAdmin,subMatterExController.UpdateSubMatterEx);

routes.put('/superAdmin/block/subMatterEx/:Id/:subMatterExId',Validate.isSuperAdmin,subMatterExController.UpdateSubMatterEx);

routes.get('/superAdmin/getAll/subMatterEx/:Id',Validate.isSuperAdmin,subMatterExController.getAllSubMatterEx);

routes.delete('/superAdmin/delete/subMatterEx/:Id/:subMatterExId',Validate.isSuperAdmin,subMatterExController.DeleteSubMatterEx);

routes.get('/superAdmin/totalSubMatterEx/:Id',Validate.isSuperAdmin,subMatterExController.totalSubMatterEx);

routes.get('/superAdmin/totalSubMatterExReport/:Id',Validate.isSuperAdmin,subMatterExController.totalSubMatterExReport);



//player  operations by super admin

routes.post('/superAdmin/player/:Id',Validate.isSuperAdmin,validatePlayer.validatePlayer,superAdminController.singUpPlayer);

routes.get('/superAdmin/player/search/:Id',Validate.isSuperAdmin,playerController.PlayerSearchOption);

routes.put('/superAdmin/update/player/:Id/:playerId',Validate.isSuperAdmin,playerController.UpdatePlayer);

routes.put('/superAdmin/block/player/:Id/:playerId',Validate.isSuperAdmin,playerController.UpdatePlayer);

routes.get('/superAdmin/getAll/player/:Id/',Validate.isSuperAdmin,playerController.getAllPlayer);

routes.delete('/superAdmin/delete/player/:Id/:playerId',Validate.isSuperAdmin,playerController.DeletePlayer);

routes.get('/superAdmin/totalPlayerReport/:Id',playerController.totalPlayerReport)


//subAdmin  operations by super admin

routes.post('/superAdmin/subAdmin/signup/:Id',Validate.isSuperAdmin,validateSubAdmin.validateSubAdmin,superAdminController.singUpSubAdmin);

routes.get('/superAdmin/subAdmin/search/:Id',Validate.isSuperAdmin,subAdminController.subAdminSearchOption);

routes.put('/superAdmin/update/subAdmin/:Id/:subAdminId',Validate.isSuperAdmin,superAdminController.UpdateSubAdminBySuperAdmin);

routes.delete('/superAdmin/delete/subAdmin/:Id/:subAdminId',Validate.isSuperAdmin,subAdminController.DeleteSubAdmin);

module.exports = {superAdminRoutes : routes}



//    localhost:8080/