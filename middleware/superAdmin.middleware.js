const superAdmin =  require('../models/superAdmin.model');
const TeamAdmin = require('../models/TeamAdmin.model');


const validateSuperAdmin = async (req,res,next) => {
    if (!req.body.email ){
        return res.status(403).send({
            message: "email  is require"
        })
    }
    else if (!req.body.Phone ){
        return res.status(403).send({
            message: "Phone number is require"
        })
    }
    else if (!req.body.password ){
        return res.status(403).send({
            message: "password  is require"
        })
    }
    else{
        next();
    }
}

const isSuperAdmin = async (req,res,next) => {
    const supperAdmin = await superAdmin.findOne({ _id: req.params.Id})
        if(!supperAdmin){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a supperAdmin rights!`
        });
    } else{
        next();
    }
}
module.exports ={
    validateSuperAdmin,
    isSuperAdmin
}