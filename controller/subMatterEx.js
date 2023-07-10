const subMatterEx =  require('../models/subMatterEx.model');
const Notification = require('../models/Notification.model');
const APIFeatures =require('../utils/ApiFeature');
require('dotenv').config();
const mongoosePaginate = require('mongoose-paginate');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const ejs = require('ejs');
let msg = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
    }
});


async function postSubMatterEx(req,res){

    const dataObj ={
        Name: req.body.Name,
        Specialization: req.body.Specialization,
        DOB: req.body.DOB,
        email: req.body.email,
        Phone: req.body.Phone,
        address: req.body.address,
        
    }
    // console.log(dataObj)
    try{
        const savedUser = await subMatterEx.findOne({Phone:req.body.Phone});
        if(savedUser){
        return res.status(400).json({message: `Subject Matter Expert With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number `,statusCode:'400'})
        }
        const UserCreated = await subMatterEx.create(dataObj)
        const template = fs.readFileSync('subExpert.ejs', 'utf-8');
        const renderedTemplate = ejs.render(template, {name: UserCreated.Name});
        let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: UserCreated.email,
            subject:'welcome ' ,
            html:renderedTemplate
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        return res.status(200).json({message: `Subject Matter Expert Created Successfully`,statusCode:'200',data:UserCreated})
    }catch(err){
        if(err.code == 11000){
            return res.status(500).json({message: `Subject Matter Expert With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number `,statusCode:'500' })
        }
        console.log("Something went wrong while saving to DB", err);
        res.status(500).json({message:err.message,statusCode:'500',status:"ERROR"})
    }
} 

async function getSubMatterById(req, res){
    try{
        let id = req.params.id;

        let user = await subMatterEx.findById(id);

        if(user){
            res.status(200).json({
                data:user,
                message: "User Fetched successfully",
                statusCode:'200'

            })
        }
        else{
            res.status(404).json({
                message:"User Not Found",
                statusCode:'404'
            })
        }

    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message,statusCode:'500',status:`ERROR`});
    }
}

async function postSubMatterExDoc(req,res){
        // console.log(req.body)
        const doc= req.files
        let links = [];
        
        for (let docNo=0; docNo <=doc.length-1;docNo++){
            let url = req.protocol +"://"+req.hostname +":8000/"+doc[docNo].path.replace(/\\/g, "/")
            links.push(url)
        }
        const Documents =links 
        try{
            const savedSubMatterEx = await subMatterEx.findOne({_id:req.params.id});
            if(!savedSubMatterEx){
            return res.status(404).json({message: `Subject Matter Not Found With This ID:${req.params.id} `,statusCode:'404'});
            }
            savedSubMatterEx.Documents = Documents != undefined
            ? Documents
            : savedSubMatterEx.Documents
            const updatedSubMatterEx = await savedSubMatterEx.save();
            res.status(201).json({message:"Subject Matter Expert",statusCode:'201',data:updatedSubMatterEx});
        }catch(error){
            console.log(error);
            res.status(500).json({message:error.message,statusCode:'500',status:`ERROR`});
        }
}

async function UpdateSubMatterEx(req,res){
    try{
    
        const ID = req.params.subMatterExId;
        // console.log(req.body)
        const savedSubMatterEx = await subMatterEx.findOne({_id:ID});
        if (!savedSubMatterEx){
            return res.status(404).json({message: "Subject Matter Expert Not Found",statusCode:'404'});
        }
        savedSubMatterEx.Name=req.body.Name ? req.body.Name : savedSubMatterEx.Name;
        savedSubMatterEx.Specialization=req.body.Specialization ? req.body.Specialization : savedSubMatterEx.Specialization;
        savedSubMatterEx.DOB=req.body.DOB ? req.body.DOB : savedSubMatterEx.DOB;
        savedSubMatterEx.email=req.body.email ? req.body.email : savedSubMatterEx.email;  
        savedSubMatterEx.Phone=req.body.Phone ? req.body.Phone : savedSubMatterEx.Phone;
        savedSubMatterEx.address=req.body.address ? req.body.address : savedSubMatterEx.address;
        savedSubMatterEx.isActive = req.body.isActive != undefined
        ? req.body.isActive
        : savedSubMatterEx.isActive
        savedSubMatterEx.isBlocked = req.body.isBlocked != undefined
        ? req.body.isBlocked
        : savedSubMatterEx.isBlocked
        
        // if(req.body.isBlocked){
        //     req.body.isBlocked=savedSubMatterEx.isBlocked;
        // }
        
        const updateSubMatterEx= await savedSubMatterEx.save()
        return res.status(201).json({ updateSubMatterEx,message: "Subject Matter Expert  Updated Successfully",statusCode:'201'})
    }catch(err){
        if(err.code == 11000){
            return res.status(500).json({message: `Subject Matter Expert With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number`,statusCode:'500' })
        }
        console.log(err)
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}

async function getAllSubMatterEx(req,res){
    try{
        const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
        const pageSize = 10; // Number of items per page
        
        subMatterEx.paginate({}, { page: pageNumber, limit: pageSize }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error occurred while fetching Data.',statusCode:'500' });
        }
        
        const { docs, total, limit, page, pages } = result;
        res.json({ data: docs, total, limit, page, pages });
        });
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500',status:`ERROR`});
    }
}


async function DeleteSubMatterEx(req,res){
    try{
        const savedSubMatterEx= await subMatterEx.findOne({_id:req.params.subMatterExId})
        if (!savedSubMatterEx){
            return res.status(404).json({message: "Subject Matter Expert Not Found",statusCode:'404'});
        }
        await subMatterEx.deleteOne({_id:req.params.subMatterExId})
        res.status(200).json({ message: `Subject Matter Expert  Deleted Successfully With ID: ${req.params.subMatterExId}`,statusCode:'200'})
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500',status:"ERROR" });
    }
}


async function subMatterExSearchOption (req, res, next) {

    try {
        const query = req.query.query;
        const term = req.query.term;
        console.log(query + term);
        const features = await new APIFeatures(subMatterEx.find().lean().populate('superAdminID','email') .lean().populate('subAdminID' ,'email'), req.query)
        .filter()
        .sort()

        const subMatterExs = await features.query;

        res.status(200).json({
        status: "success",
        statusCode: 200,
        results: subMatterExs.length,
        searchData: subMatterExs,
        });
    } catch (err) {
        console.log(err)
    res.status(404).json({message: err.message, statusCode:'404',status:`ERROR`});
    }
};

async function totalSubMatterEx(req,res){
    const pipeline =[
        [
            {
            '$count': 'totalSubMatterEx'
            }
        ]
    ]
    try{
        const totalSubMatterEx = await subMatterEx.aggregate(pipeline);
        
        res.status(200).json({message:'Data Fetched Successfully',statusCode:'200',data:totalSubMatterEx})
    }catch(err){
        res.status(500).json({message:err.message,statusCode:'500',status:`ERROR` })
    }
}

async function totalSubMatterExReport(req,res){
    const pipeline =[
        [
            {
            '$count': 'totalSubMatterEx'
            }
        ]
    ]
    const pipeline1 =[
        [
            {
                '$match': {
                    'isActive': true
                }
                },
                {
                    '$group': {
                        '_id': 'total Active totalSubMatterEx', 
                        'value': {
                        '$count': {}
                        }
                    }
                }
            ]   
        ]
    const pipeline2 =[
        [
            {
                '$match': {
                    'isBlocked': true
                }
                },
                {
                    '$group': {
                        '_id': 'total Blocked totalSubMatterEx', 
                        'value': {
                        '$count': {}
                        }
                    }
                }
        ]
    ]
    try{
        const count = await subMatterEx.aggregate(pipeline);
        const isActive = await subMatterEx.aggregate(pipeline1);
        const isBlocked = await subMatterEx.aggregate(pipeline2);

        let Data = [count[0],isActive[0],isBlocked[0]]
        res.status(200).json({message:'Data Fetched Successfully',statusCode:'200',label:`totalSubMatterExReport`,Data})
    }catch(err){
        res.status(500).json({message:err.message,statusCode:'500',status:`ERROR` })
    }
}

async function getAllSubMatterExNotification(req,res){
    try{
        const savedSubMatterEx = await subMatterEx.findOne({_id:req.params.userID});
        if (!savedSubMatterEx){
            return res.status(404).json({message: "Subject Matter Expert Not Found",statusCode:'404'});
        }
        const message = await Notification.find({userID:req.params.userID})
        return res.status(200).json({message:'Notification Fetched Successfully ',length:message.length ,data:message});
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}

async function getSubMatterExNotification(req,res){
    try{
        const savedSubMatterEx = await subMatterEx.findOne({_id:req.params.userID});
        if (!savedSubMatterEx){
            return res.status(404).json({message: "Subject Matter Expert Not Found",statusCode:'404'});
        }
        const message = await Notification.findOne({_id:req.params.msgID})
        return res.status(200).json({message:'Sub Admin Fetched Successfully',statusCode:'200',length:message.length ,data:message});
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}

async function deleteSubMatterExNotification(req,res){
    try{
        const savedSubMatterEx = await subMatterEx.findOne({_id:req.params.userID});
        if (!savedSubMatterEx){
            return res.status(404).json({message: "Subject Matter Expert Not Found",statusCode:'404'});
        }
        const savedNotification = await Notification.findOne({_id:req.params.msgID})
        if (!savedNotification){
            return res.status(404).json({message: "Message Not Found",statusCode:'404'});
        }
        await savedNotification.deleteOne({_id:req.params.msgID});
        return res.status(200).json({ message: `Notification  Deleted Successfully With Notification ID: ${req.params.msgID}`,statusCode:'200'})
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}


async function updatePasswordToSubMatterEx(req,res){
    try{
        const ID = req.body.userId;
        // console.log(req.body)
        const savedSubMatterEx = await subMatterEx.findOne({_id:ID});
        if (!savedSubMatterEx){
            return res.status(404).json({message: "Subject Matter Expert Not Found",statusCode:'404'});
        }
        savedSubMatterEx.password = await bcrypt.hash(req.body.password,10)
        ? await bcrypt.hash(req.body.password,10)
        : savedSubMatterEx.password;

        savedSubMatterEx.isActive = true;
        
        const updatedSubMatterEx = await savedSubMatterEx.save();
        let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: savedSubMatterEx.email,
            subject:'Your Login Credential' ,
            text: `Dear ${updatedSubMatterEx.Name}, Use this credentials email:${savedSubMatterEx.email} password:${req.body.password} for login in to your ITFC account `
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        return res.status(201).json({ data:updatedSubMatterEx,message: "Subject Matter Expert Updated Successfully",statusCode:'201'})
    }catch(err){
        console.log(err)
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}


async function postLogin(req, res, next){
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const savedSubMatterEx= await subMatterEx.findOne({ email: email})
        if(!savedSubMatterEx){
            return res.status(404).json({message:`Subject Matter Expert Not Found With This Email ${req.body.email}`,statusCode:'404'});
        }
        loadedUser = savedSubMatterEx;
        bcrypt.compare(password, savedSubMatterEx.password)
        .then(doMatch => {
            if(!doMatch){
                return res.status(401).json({message:'Password Do Not Match',statusCode:'401'});
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id,
            },process.env.SECRET_KEY, {expiresIn: '3h'});
            const  postResponse={   
                token: token,
                userId: loadedUser._id.toString()
            }
            res.status(200).json({message: 'Sign In Successful',statusCode:'200',data:postResponse})
        })
        .catch(error =>{
        console.log(error)
        res.status(500).json({message: error.message, statusCode:'500',status:'error'});
    })
}

//sending mail about rest password with rest password page link
async function forgotPassword(req,res){
const {email}= req.body;
const User = await subMatterEx.findOne({ email: req.body.email });
if(!User){
    res.send('Associate Member Not Registered');
    return;
}

const payload = {
    userId: User._id,
    email:User.email 
}
let token = jwt.sign(payload, process.env.SECRET_KEY + User.password, { expiresIn: 86400 });// 24 hours
const Link = `http://localhost:8000/subjectMatterExpert/rest-password/${User._id}/${token}`
console.log(Link)


let mailOptions = {
    from: 'serviceacount.premieleague@gmail.com',
    to: User.email,
    subject:'Rest password' ,
    text:`Click on link to reset your password    ${Link}`
};
msg.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);
    }
});
res.send('Password reset link has been sent to your email..!')

}

//user rest password page for getting the new password from user

async function getResetPassword(req,res){
const{id,token} =  req.params;
const user = await subMatterEx.findOne({ _id: req.params.id })
if(!user){
    res.send('Invalid Id...!');
}
try{
    const payload =jwt.verify(token,process.env.SECRET_KEY + user.password);
    res.render('reset-password',{email:user.email});

}catch(error){
    console.log(error.message);
    res.send(error.message);
}
}

//updating user password

async function ResetPassword(req,res){
const{id,token} =  req.params;
const user = await subMatterEx.findOne({ _id: req.params.id });
if(!user){
    res.send('Invalid Id...!');
}
try{
    const payload = jwt.verify(token,process.env.SECRET_KEY + user.password);
    
        user.password= bcrypt.hashSync(req.body.password, 16) ? bcrypt.hashSync(req.body.password, 16) : user.password
    const updatedUser= await user.save(user);
    res.status(200).json({message:'Password Updated Successfully',statusCode:'200',data:updatedUser});
}catch(error){
    console.log(error.message);
    res.send(error.message);
}
}



module.exports={
    postSubMatterEx,
    postSubMatterExDoc,
    UpdateSubMatterEx,
    getAllSubMatterEx,
    getSubMatterById,
    DeleteSubMatterEx,
    subMatterExSearchOption,
    totalSubMatterEx,
    totalSubMatterExReport,
    getAllSubMatterExNotification,
    getSubMatterExNotification,
    deleteSubMatterExNotification,
    updatePasswordToSubMatterEx,
    postLogin,
    forgotPassword,
    getResetPassword,
    ResetPassword
}