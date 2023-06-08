const associateMember = (req,res,next) => {
    // console.log(req.files);
    const userObj = {
        fName : req.body.fName,
        mName : req.body.mName,
        lName : req.body.lName,
        age : req.body.age,
        DOB : req.body.DOB,
        email : req.body.email,
        Phone : req.body.Phone,
        ResidentialAddress : req.body.ResidentialAddress,
        OfficeAddress : req.body.OfficeAddress,
        CricketingExperience : req.body.CricketingExperience,
    }
    if (!userObj.fName ){
        return res.status(403).send({
            message: "fName is require"
        })
    }
    if (!userObj.mName ){
        return res.status(403).send({
            message: "mName  is require"
        })
    }else if (!userObj.lName  ){
        return res.status(403).send({
            message: "lName   is require"
        })
    }else if (!userObj.age ){
        return res.status(403).send({
            message: "age  is require"
        })
    }
    else if (!userObj.DOB ){
        return res.status(403).send({
            message: "DOB  is require"
        })
    }
    else if (!userObj.email ){
        return res.status(403).send({
            message: "email  is require"
        })
    }else if (!userObj.Phone){
        return res.status(403).send({
            message: "Phone Number is require"
        })
    }
    else if (!userObj.ResidentialAddress){
        return res.status(403).send({
            message: "Residential Address  is require"
        })
    }
    else if (!userObj.CricketingExperience){
        return res.status(403).send({
            message: "Cricketing Experience is require"
        })
    }
    else{
        next();
    }
}

module.exports ={
    associateMember
}