const validateTeamAdmin =(req,res,next)=>{
    const AdminUserObj ={
        fName: req.body.fName,
        lName: req.body.lName,
        age: req.body.age,
        DOB:req.body.DOB,
        Skills: req.body.Skills,
        Phone: req.body.Phone,
        email: req.body.email,
        
    }
    if (!AdminUserObj.fName ){
        return res.status(403).send({
            message: "first Name is require"
        })
    }
    if (!AdminUserObj.lName ){
        return res.status(403).send({
            message: "Last Name is require"
        })
    }else if (!AdminUserObj.age  ){
        return res.status(403).send({
            message: "age   is require"
        })
    }else if (!AdminUserObj.DOB ){
        return res.status(403).send({
            message: "DOB  is require"
        })

    }else if (!AdminUserObj.Skills){
        return res.status(403).send({
            message: "Skill is require"
        })
    }
    else if (!AdminUserObj.Phone){
        return res.status(403).send({
            message: "Phone number is require"
        })
    }
    else if (!AdminUserObj.email){
        return res.status(403).send({
            message: "email is require"
        })
    }
    else{
        next();
    }
}


const validateTeamAdminSignIn =(req,res,next)=>{
    const AdminUserObj ={
        UID: req.body.id,
    }
    if (!AdminUserObj.UID ){
        return res.status(403).send({
            message: "UID is require"
        })
    }
    else{
        next();
    }
}




module.exports={
    validateTeamAdmin,
    validateTeamAdminSignIn,
    
}
