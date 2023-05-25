const subAdmin =  require('../models/subAdmin.model');

const validateSubAdmin = async (req,res,next) => {
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

const isSubAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
module.exports ={
    validateSubAdmin,
    isSubAdmin
}