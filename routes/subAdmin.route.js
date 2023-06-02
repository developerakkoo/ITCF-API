const express = require('express');
const routes = express.Router();
//controllers
const subAdminController = require('../controller/subAdminController');
const associateMemberController = require('../controller/associateMember.controller');
const TeamAdminController = require('../controller/TeamAdmin.controller');
const TeamAController = require('../controller/team.controller');
const playerController = require('../controller/player.controller');
const subMatterExController = require('../controller/subMatterEx');

//middleware
const validateSubAdmin = require('../middleware/subAdmin.middleware');
const validateTeamAdmin = require('../middleware/TeamAdmin.middleware');
const ValidateAssociateMember = require('../middleware/associateMember.middleware');
const validateTeam = require('../middleware/team.middleware');
const validateSubMatterEx =require('../middleware/subMatterEx.middleware');
const validatePlayer = require('../middleware/player.middleware');
const Upload = require('../middleware/upload');
const Validate = require('../middleware/subAdmin.middleware');
const { validate } = require('../models/superAdmin.model');



routes.post('/subAdmin/signup',Validate.validateSubAdmin,subAdminController.postSignup);

routes.post('/subAdmin/login',subAdminController.postLogin);

routes.get('/subAdmin/search',subAdminController.subAdminSearchOption);

routes.put('/update/subAdmin/:subAdminId',subAdminController.UpdateSubAdmin);

routes.delete('/delete/subAdmin/:subAdminId',subAdminController.DeleteSubAdmin);

routes.get('/getAll/subAdmin/notification/:userID',subAdminController.getAllSubAdminNotification);

routes.post('/subAdmin/notifyUsers/:Id',subAdminController.sendNotificationBySubAdmin);

routes.put('/subAdmin/update/notification/:Id/:notificationId',Validate.isSubAdmin,subAdminController.subAdminUpdateNotification)

routes.get('/get/subAdmin/notification/:userID/:msgID',subAdminController.getSubAdminNotification);

routes.delete('/delete/subAdmin/notification/:userID/:msgID',subAdminController.deleteSubAdminNotification);

// routes.get('/count/subAdmin',subAdminController);

//teamAdmin operations by subAdmin

routes.post('/subAdmin/teamAdmin/signUp/:Id',[Validate.isSubAdmin,Validate.canCreateTeamAdmin,validateTeamAdmin.validateTeamAdmin],subAdminController.signUpTeamAdminBySubAdmin);

routes.get('/subAdmin/getAll/teamAdmin/:Id',[Validate.isSubAdmin,Validate.canGetTeamAdmin],TeamAdminController.getAllTeamAdmin);

routes.get('/subAdmin/teamAdmin/search/:Id',[Validate.isSubAdmin,Validate.canGetTeamAdmin],TeamAdminController.teamAdminSearchOption);

routes.put('/subAdmin/block/teamAdmin/:Id/:teamAdID',[Validate.isSubAdmin,Validate.canBlockTeamAdmin],TeamAdminController.UpdateTeamAdmin);

routes.put('/subAdmin/update/teamAdmin/:Id/:teamAdID',[Validate.isSubAdmin,Validate.canUpdateSubAdmin],TeamAdminController.UpdateTeamAdmin);

routes.delete('/subAdmin/delete/teamAdmin/:Id/:teamAdID',[Validate.isSubAdmin,Validate.canDeleteSubAdmin],TeamAdminController.DeleteTeamAdmin);

routes.get('/subAdmin/totalTeamAdmin/:Id',[Validate.isSubAdmin],TeamAdminController.totalTeamAdmin);

routes.get('/subAdmin/totalTeamAdminReport/:Id',[Validate.isSubAdmin],TeamAdminController.totalTeamAdminReport);


//Team  operations by sub admin


routes.post('/subAdmin/post/team/:Id',[Validate.isSubAdmin,Validate.canCreateTeam],validateTeam.validateTeam,subAdminController.signUpTeamBySubAdmin)

routes.put('/subAdmin/update/team/:Id/:teamId',[Validate.isSubAdmin,Validate.canUpdateTeam],TeamAController.UpdateTeam);

routes.put('/subAdmin/block/team/:Id/:teamId',[Validate.isSubAdmin,Validate.canBlockTeam],TeamAController.UpdateTeam);

routes.get('/subAdmin/team/search/:Id',[Validate.isSubAdmin,Validate.canGetTeam],TeamAController.teamSearchOption);

routes.get('/subAdmin/getAll/team/:Id',[Validate.isSubAdmin],TeamAController.getAllTeam);

routes.get('/subAdmin/getById/team/:Id',[Validate.isSubAdmin],TeamAController.getTeamById);

routes.delete('/subAdmin/delete/team/:Id/:teamId',[Validate.isSubAdmin,Validate.canDeleteTeam],TeamAController.DeleteTeam);

routes.get('/subAdmin/totalTeamReport/:Id',[Validate.isSubAdmin],TeamAController.totalTeamReport);

// routes.get('/totalTeam/:Id',[Validate.isSubAdmin,Validate.],TeamAController.totalTeamCount);


//associate member operations by super admin

routes.post('/subAdmin/post/associateMember/:Id',Validate.isSubAdmin,Validate.canCreateAssociateMember,Upload.fields([{name:'PANCard',maxCount: 1},{name:'ADHARCard',maxCount: 1},{name:'residentialProof',maxCount: 1},{name:'ITR',maxCount: 1}]),ValidateAssociateMember.associateMember,subAdminController.signUpAssociateMemberBySubAdmin);

routes.get('/subAdmin/associateMember/search/:Id',[Validate.isSubAdmin,Validate.canGetAssociateMember],associateMemberController.AssociateMemberSearchOption);

routes.put('/subAdmin/update/associateMember/:Id/:associateMemberId',[Validate.isSubAdmin,Validate.canUpdateAssociateMember],associateMemberController.UpdateAssociateMember);

routes.put('/subAdmin/block/associateMember/:Id/:associateMemberId',[Validate.isSubAdmin,Validate.canBlockAssociateMember],associateMemberController.UpdateAssociateMember);

routes.get('/subAdmin/getAll/associateMember/:Id',[Validate.isSubAdmin,Validate.canGetAssociateMember],associateMemberController.getAllAssociateMember);

routes.delete('/subAdmin/delete/associateMember/:Id/:associateMemberId',[Validate.isSubAdmin,Validate.canDeleteAssociateMember],associateMemberController.DeleteAssociateMember);

routes.get('/subAdmin/totalAssociateMember/:Id',[Validate.isSubAdmin],associateMemberController.totalAssociateMember);

routes.get('/subAdmin/totalAssociateMemberReport/:Id',[Validate.isSubAdmin],associateMemberController.totalAssociateMemberReport);

routes.get('/subAdmin/getAll/AssociateMember/notification/:Id/:userID',Validate.isSubAdmin,associateMemberController.getAllAssociateMemberNotification)

routes.get('/subAdmin/get/AssociateMember/notification/:Id/:userID/:msgID',Validate.isSubAdmin,associateMemberController.getAssociateMemberNotification);

routes.delete('/subAdmin/delete/AssociateMember/notification/:Id/:userID/:msgID',Validate.isSubAdmin,associateMemberController.deleteAssociateMemberNotification);

//subMatterEx  operations by super admin

routes.post('/subAdmin/post/subMatterEx/:Id',Validate.isSubAdmin,Validate.canCreateSubMatterEx,Upload.array('Docs',10),validateSubMatterEx.SubMatterEx,subAdminController.signUpMatterExBySubAdmin);

routes.get('/subAdmin/subMatterEx/search/:Id',[Validate.isSubAdmin,Validate.canGetSubMatterEx],subMatterExController.subMatterExSearchOption);

routes.put('/subAdmin/update/subMatterEx/:Id/:subMatterExId',[Validate.isSubAdmin,Validate.canUpdateSubMatterEx],subMatterExController.UpdateSubMatterEx);

routes.put('/subAdmin/block/subMatterEx/:Id/:subMatterExId',[Validate.isSubAdmin,Validate.canBlockSubMatterEx],subMatterExController.UpdateSubMatterEx);

routes.get('/subAdmin/getAll/subMatterEx/:Id',[Validate.isSubAdmin,Validate.canGetSubMatterEx],subMatterExController.getAllSubMatterEx);

routes.delete('/subAdmin/delete/subMatterEx/:Id/:subMatterExId',[Validate.isSubAdmin,Validate.canDeleteSubMatterEx],subMatterExController.DeleteSubMatterEx);


routes.get('/subAdmin/totalSubMatterEx/:Id',[Validate.isSubAdmin],subMatterExController.totalSubMatterEx);

routes.get('/subAdmin/totalSubMatterExReport/:Id',[Validate.isSubAdmin],subMatterExController.totalSubMatterExReport);



//player  operations by super admin

routes.post('/subAdmin/player/:Id',[Validate.isSubAdmin,Validate.canCreatePlayer,validatePlayer.validatePlayer],subAdminController.singUpPlayerBySubAdmin);

routes.get('/subAdmin/player/search/:Id',Validate.isSubAdmin,Validate.canGetPlayer,playerController.PlayerSearchOption);

routes.put('/subAdmin/update/player/:Id/:playerId',Validate.isSubAdmin,Validate.canUpdatePlayer,playerController.UpdatePlayer);

routes.put('/subAdmin/block/player/:Id/:playerId',[Validate.isSubAdmin,Validate.canBlockPlayer],playerController.UpdatePlayer);

routes.get('/subAdmin/getAll/player/:Id/',[Validate.isSubAdmin,Validate.canGetPlayer],playerController.getAllPlayer);

routes.delete('/subAdmin/delete/player/:Id/:playerId',[Validate.isSubAdmin,Validate.canDeletePlayer],playerController.DeletePlayer);

routes.get('/subAdmin/totalPlayerReport/:Id',[Validate.isSubAdmin],playerController.totalPlayerReport)


//subAdmin  operations by super admin

routes.post('/subAdmin/subAdmin/signup/:Id',[Validate.isSubAdmin,Validate.canCreateSubAdmin,validateSubAdmin.validateSubAdmin],subAdminController.postSignupBySubAdmin);

routes.get('/subAdmin/subAdmin/search/:Id',[Validate.isSubAdmin,Validate.canGetSubAdmin],subAdminController.subAdminSearchOption);

routes.put('/subAdmin/update/subAdmin/:Id/:subAdminId',[Validate.isSubAdmin,Validate.canUpdateSubAdmin],subAdminController.UpdateSubAdminBySubAdmin);

routes.put('/subAdmin/block/subAdmin/:Id/:subAdminId',[Validate.isSubAdmin,Validate.canBlockSubAdmin],subAdminController.UpdateSubAdminBySubAdmin);

routes.delete('/subAdmin/delete/subAdmin/:Id/:subAdminId',[Validate.isSubAdmin,Validate.canDeleteSubAdmin],subAdminController.DeleteSubAdmin);






module.exports = {subAdminRoutes : routes}



//    localhost:8080/