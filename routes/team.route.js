const express = require('express');
const routes = express.Router();
const TeamController = require('../controller/team.controller')
const Validate = require('../middleware/team.middleware') 



routes.post('/team',Validate.validateTeam,TeamController.postTeam)

routes.put('/update/team/:Id',TeamController.UpdateTeam);

routes.get('/team/search',TeamController.teamSearchOption);

routes.get('/getAll/team',TeamController.getAllTeam);

routes.get('/getById/team/:Id',TeamController.getTeamById);

routes.delete('/delete/team/:Id',TeamController.DeleteTeam);

routes.get('/getAll/team/notification/:userID',TeamController.getAllTeamNotification);

routes.get('/get/team/notification/:userID/:msgID',TeamController.getTeamNotification);

routes.delete('/delete/team/notification/:userID/:msgID',TeamController.deleteTeamNotification);


module.exports = {TeamRoutes : routes}