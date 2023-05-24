const express = require('express');
const routes = express.Router();
const subMatterExController = require('../controller/subMatterEx');
const Upload = require('../middleware/upload');
const Validate =require('../middleware/subMatterEx.middleware');


routes.post('/post/subMatterEx',Upload.array('Docs',10),Validate.SubMatterEx,subMatterExController.postSubMatterEx);

routes.get('/subMatterEx/search',subMatterExController.subMatterExSearchOption);

routes.put('/update/subMatterEx/:Id',subMatterExController.UpdateSubMatterEx);

routes.get('/getAll/subMatterEx',subMatterExController.getAllSubMatterEx);

routes.delete('/delete/subMatterEx/:Id',subMatterExController.DeleteSubMatterEx);



module.exports = {subMatterExRoutes : routes}


