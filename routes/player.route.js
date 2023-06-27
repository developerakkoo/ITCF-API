const express = require('express');
const routes = express.Router();
const playerController = require('../controller/player.controller');
const Validate = require('../middleware/player.middleware');
const Upload = require('../middleware/upload');

//logIn

routes.get('/plyer/phoneNo/verify/',playerController.verifyNumber);

routes.post('/player/:playerId',Validate.validatePlayer,playerController.postPlayer);

routes.put('/upload/image/player/:playerId',Upload.single("file"),playerController.postPlayerImage);

routes.put('/set/password',playerController.setPassword);

routes.post('/player-registered/notify-admin',playerController.sendSmSToAdmin);

//

routes.get('/player/search',playerController.PlayerSearchOption);

routes.put('/update/player/:playerId',playerController.UpdatePlayer);

routes.put('/proMember/player/:playerId',playerController.proPlayer);

routes.get('/getAll/player',playerController.getAllPlayer);

routes.get('/getById/player/:Id',playerController.getPlayerById);

routes.delete('/delete/player/:playerId',playerController.DeletePlayer);

routes.get('/count/player',playerController.totalPlayer);

routes.get('/getAll/player/notification/:userID',playerController.getAllPlayersNotification);

routes.get('/get/player/notification/:userID/:msgID',playerController.getPlayerNotification);

routes.delete('/delete/player/notification/:userID/:msgID',playerController.deletePlayerNotification);

routes.get('/get',playerController.get)





module.exports = {playerRoutes : routes}



//    localhost:8080/