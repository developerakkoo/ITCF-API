const SubMatterEx = async (req,res,next) => {
    const dataObj ={
        Name: req.body.Name,
        Specialization: req.body.Specialization,
        DOB: req.body.DOB,
        email: req.body.email,
        Phone: req.body.Phone,
        address: req.body.address,
        Documents:links,  
    }
    if (!dataObj.Name ){
        return res.status(403).send({
            message: "Name is require"
        })
    }
    if (!dataObj.Specialization ){
        return res.status(403).send({
            message: "Specialization  is require"
        })
    }else if (!dataObj.DOB  ){
        return res.status(403).send({
            message: "DOB   is require"
        })
    }else if (!dataObj.email ){
        return res.status(403).send({
            message: "email  is require"
        })
    }
    else if (!dataObj.Phone ){
        return res.status(403).send({
            message: "Phone number is require"
        })
    }
    else if (!dataObj.address ){
        return res.status(403).send({
            message: "address  is require"
        })
    }else if (!dataObj.Documents){
        return res.status(403).send({
            message: "Documents is require"
        })
    }
    else{
        next();
    }
}

module.exports ={
    SubMatterEx
}