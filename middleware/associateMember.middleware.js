const associateMember = (req,res,next) => {
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
        panCard:req.protocol +"://"+req.hostname +"/"+ req.files.PANCard[0].path.replace(/\\/g, "/"),
        AdharCard : req.protocol +"://"+req.hostname +"/"+ req.files.ADHARCard[0].path.replace(/\\/g, "/"),
        residentialProof:req.protocol +"://"+req.hostname +"/"+ req.files.residentialProof[0].path.replace(/\\/g, "/"),
        ITR:req.protocol +"://"+req.hostname +"/"+ req.files.ITR[0].path.replace(/\\/g, "/"),
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
    else if (!userObj.panCard ){
        return res.status(403).send({
            message: "panCard  is require"
        })
    }else if (!userObj.AdharCard){
        return res.status(403).send({
            message: "AdharCard Number is require"
        })
    }
    else if (!userObj.residentialProof){
        return res.status(403).send({
            message: "Residential Address  is require"
        })
    }
    else if (!userObj.ITR){
        return res.status(403).send({
            message: "ITR is require"
        })
    }
    else{
        next();
    }
}



module.exports ={
    associateMember
}