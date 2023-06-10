const Team =  require('../models/Team.model');

const validateTeam =(req,res,next)=>{
    const teamObj ={
        teamAdminUID:req.body.teamAdminUID,
        AdminID: req.body.AdminID,
        teamName: req.body.teamName,
        teamCity: req.body.teamCity,
        address: req.body.address
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
    }else if (!teamObj.teamCity ){
        return res.status(403).send({
            message: "teamCity  is require"
        })
    }
    else if (!teamObj.address){
        return res.status(403).send({
            message: "address is require"
        })
    }
    else{
        next();
    }
}





module.exports ={
    validateTeam
}