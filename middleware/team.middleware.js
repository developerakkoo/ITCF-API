const Team =  require('../models/Team.model');

const validateTeam =(req,res,next)=>{
    const teamObj ={
        teamAdminUID:req.body.teamAdminUID,
        AdminID: req.body.AdminID,
        teamName: req.body.teamName,
        teamCity: req.body.teamCity,
        addressLine1: req.body.addressLine1,
        pinCode:req.body.pinCode,
        city:req.body.city,
        state:req.body.state
    }
    if (!teamObj.teamAdminUID ){
        return res.status(403).send({
            message: "teamAdminUID Name is require"
        })
    }
    if (!teamObj.AdminID ){
        return res.status(403).send({
            message: "Last Name is require"
        })
    }else if (!teamObj.teamName  ){
        return res.status(403).send({
            message: "teamName   is require"
        })
    }
    
    else if (!teamObj.addressLine1  ){
        return res.status(403).send({
            message: "addressLine1   is require"
        })
    }else if (!teamObj.pinCode ){
        return res.status(403).send({
            message: "pinCode  is require"
        })
    }
    else if (!teamObj.teamCity ){
        return res.status(403).send({
            message: "teamCity  is require"
        })
    }
    else if (!teamObj.state){
        return res.status(403).send({
            message: "state is require"
        })
    }
    else{
        next();
    }
}





module.exports ={
    validateTeam
}