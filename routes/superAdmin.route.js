const express = require('express');
const routes = express.Router();
const superAdminController = require('../controller/superAdmin.controller');
const TeamAdminController = require('../controller/TeamAdmin.controller');
const associateMemberController = require('../controller/associateMember.controller');
const TeamAController = require('../controller/team.controller');
const subMatterExController = require('../controller/subMatterEx');
const Validate = require('../middleware/superAdmin.middleware');
const validateTeamAdmin = require('../middleware/TeamAdmin.middleware');
const ValidateAssociateMember = require('../middleware/associateMember.middleware')
const validateTeam = require('../middleware/team.middleware');
const validateSubMatterEx =require('../middleware/subMatterEx.middleware');
const Upload = require('../middleware/upload');


routes.post('/superAdmin/signup',Validate.validateSuperAdmin,superAdminController.postSignup);

routes.post('/superAdmin/login',superAdminController.postLogin);

routes.put('/update/superAdmin/:Id',Validate.isSuperAdmin,superAdminController.UpdateSuperAdmin);

routes.delete('/delete/superAdmin/:Id',superAdminController.DeleteSuperAdmin);

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

routes.put('/superAdmin/update/associateMember/:Id/:associateMemberId',Validate.isSuperAdmin,associateMemberController.UpdateAssociateMember);

routes.put('/superAdmin/block/associateMember/:Id/:associateMemberId',Validate.isSuperAdmin,associateMemberController.UpdateAssociateMember);

routes.get('/superAdmin/getAll/associateMember/:Id',Validate.isSuperAdmin,associateMemberController.getAllAssociateMember);

routes.delete('/superAdmin/delete/associateMember/:Id/:associateMemberId',Validate.isSuperAdmin,associateMemberController.DeleteAssociateMember);

routes.get('/superAdmin/totalAssociateMember/:Id',Validate.isSuperAdmin,associateMemberController.totalAssociateMember);

routes.get('/superAdmin/totalAssociateMemberReport/:Id',Validate.isSuperAdmin,associateMemberController.totalAssociateMemberReport);



//subMatterEx  operations by super admin

routes.post('/superAdmin/post/subMatterEx/:Id',Validate.isSuperAdmin,Upload.array('Docs',10),validateSubMatterEx.SubMatterEx,superAdminController.signUpMatterEx);

routes.get('/superAdmin/subMatterEx/search/:Id',Validate.isSuperAdmin,subMatterExController.subMatterExSearchOption);

routes.put('/superAdmin/update/subMatterEx/:Id/:subMatterExId',Validate.isSuperAdmin,subMatterExController.UpdateSubMatterEx);

routes.put('/superAdmin/block/subMatterEx/:Id/:subMatterExId',Validate.isSuperAdmin,subMatterExController.UpdateSubMatterEx);

routes.get('/superAdmin/getAll/subMatterEx/:Id',Validate.isSuperAdmin,subMatterExController.getAllSubMatterEx);

routes.delete('/superAdmin/delete/subMatterEx/:Id/:subMatterExId',Validate.isSuperAdmin,subMatterExController.DeleteSubMatterEx);

routes.get('/superAdmin/totalSubMatterEx/:Id',Validate.isSuperAdmin,subMatterExController.totalSubMatterEx);

routes.get('/superAdmin/totalSubMatterExReport/:Id',Validate.isSuperAdmin,subMatterExController.totalSubMatterExReport);



module.exports = {superAdminRoutes : routes}



//    localhost:8080/