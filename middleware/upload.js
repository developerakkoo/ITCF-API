const path = require('path');
const multer = require('multer');

let   storage = multer.diskStorage({
    destination:function(req, file, cb){
            cb(null, 'public/')   // file location 
    },
    filename : function (req,file, cb){              
        let ext = path.extname(file.originalname) 
        cb(null, Date.now() + ext)                                               // Rename the file with current time tamp & extension
    }
})

let uploadOwner = multer({
    storage : storage,
    fileFilter: function(req, file, callback){
        callback(null, true)
    },
})



module.exports = uploadOwner
