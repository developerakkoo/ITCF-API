const express = require('express');
const routes = express.Router();
const playerController = require('../controller/player.controller');
const Validate = require('../middleware/player.middleware');



routes.post('/player',Validate.validatePlayer,playerController.postPlayer);

routes.get('/player/search',playerController.PlayerSearchOption);

routes.put('/update/player/:Id',playerController.UpdatePlayer);

routes.get('/getAll/player',playerController.getAllPlayer);

routes.get('/getById/player/:Id',playerController.getPlayerById);

routes.delete('/delete/player/:Id',playerController.DeletePlayer);

routes.get('/count/player',playerController.totalPlayer);


routes.get('/get',playerController.get)





module.exports = {playerRoutes : routes}



//    localhost:8080/