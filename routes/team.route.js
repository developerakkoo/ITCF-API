const express = require('express');
const routes = express.Router();
const TeamController = require('../controller/team.controller');
const Validate = require('../middleware/team.middleware');
const Upload = require('../middleware/upload');


routes.post('/team',Validate.validateTeam,TeamController.postTeam)

routes.put('/upload/teamLogo/Team/:teamId',Upload.single("file"),TeamController.postTeamLogo);

routes.put('/update/team/:teamId',TeamController.UpdateTeam);

routes.get('/team/search',TeamController.teamSearchOption);

routes.get('/getAll/team',TeamController.getAllTeam);

routes.get('/getById/team/:teamId',TeamController.getTeamById);

routes.delete('/delete/team/:teamId',TeamController.DeleteTeam);

routes.get('/getAll/team/notification/:userID',TeamController.getAllTeamNotification);

routes.get('/get/team/notification/:userID/:msgID',TeamController.getTeamNotification);

routes.delete('/delete/team/notification/:userID/:msgID',TeamController.deleteTeamNotification);


module.exports = {TeamRoutes : routes}