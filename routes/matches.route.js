const routes = require('express').Router();
const matches = require('../controller/matches.controller');

routes.post('/crate/match',matches.createMatch);

routes.put('/update/match',matches.updateMach);

routes.get('/getAll/matches',matches.getAllMatches);

routes.get('/get/matchById/:Id',matches.getMatchById);

routes.get('/get/matchByMatchId/:matchId',matches.getMatchByMatchId);

routes.get('/search/match',matches.matchSearchOption);

routes.put('/update/match/status',matches.updateMachStatus);

module.exports = {matchesRoutes : routes}