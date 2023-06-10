const validatePlayer =(req,res,next)=>{
    const playerObj ={
        Name: req.body.Name,
        age: req.body.age,
        DOB: req.body.DOB,
        email: req.body.email,
        Phone: req.body.Phone,
        Skills: req.body.Skills,
    }
    if (!playerObj.Name ){
        return res.status(403).send({
            message: "Name  is require"
        })
    }
    else if (!playerObj.age ){
        return res.status(403).send({
            message: "age  is require"
        })
    }
    else if (!playerObj.DOB ){
        return res.status(403).send({
            message: "DOB  is require"
        })
    }else if (!playerObj.Skills){
        return res.status(403).send({
            message: "Skills is require"
        })
    }
    else if (!playerObj.Phone){
        return res.status(403).send({
            message: "Phone number is require"
        })
    }
    else if (!playerObj.email){
        return res.status(403).send({
            message: "email is require"
        })
    }
    else{
        next();
    }
}


module.exports ={
    validatePlayer
}