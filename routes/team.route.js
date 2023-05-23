const express = require('express');
const routes = express.Router();
const TeamAController = require('../controller/team.controller')
const Validate = require('../middleware/team.middleware') 



routes.post('/team',Validate.validateTeam,TeamAController.postTeam)

routes.put('/update/team/:Id',TeamAController.UpdateTeam);

routes.get('/team/search',TeamAController.teamSearchOption);

routes.get('/getAll/team',TeamAController.getAllTeam);

routes.get('/getById/team/:Id',TeamAController.getTeamById);

routes.delete('/delete/team/:Id',TeamAController.DeleteTeam);

routes.get('/totalTeamReport',TeamAController.totalTeamReport);

routes.get('/totalTeam',TeamAController.totalTeamCount);

module.exports = {TeamRoutes : routes}