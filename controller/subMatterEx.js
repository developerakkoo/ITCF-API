const subMatterEx =  require('../models/subMatterEx.model');
const Notification = require('../models/Notification.model');
const APIFeatures =require('../utils/ApiFeature');
require('dotenv').config();
const mongoosePaginate = require('mongoose-paginate');
const nodemailer = require('nodemailer');
let msg = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
    }
});


async function postSubMatterEx(req,res){
    console.log(req.body)
    const doc= req.files
    let links = [];
    // res.status(200).json({msg:"ok"})
    for (let docNo=0; docNo <=doc.length-1;docNo++){
        // console.log(req.protocol +"://"+req.hostname +"/"+doc[docNo].path.replace(/\\/g, "/"),doc[docNo].path.replace(/\\/g, "/"))
        let url = req.protocol +"://"+req.hostname +"/"+doc[docNo].path.replace(/\\/g, "/")
        links.push(url)
    }
    const dataObj ={
        Name: req.body.Name,
        Specialization: req.body.Specialization,
        DOB: req.body.DOB,
        email: req.body.email,
        Phone: req.body.Phone,
        address: req.body.address,
        Documents:links,  
    }
    // console.log(dataObj)
    try{
        const savedUser = await subMatterEx.findOne({Phone:req.body.Phone});
        if(savedUser){
        return res.status(400).json({message: `User with this email or phone number is already exist please try with different  email or phone number `})
        }
        const UserCreated = await subMatterEx.create(dataObj)
        let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: UserCreated.email,
            subject:'welcome ' ,
            text:`welcome ${UserCreated.Name} account created successfully`
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        return res.status(201).json({message: `User created Successfully`,UserCreated})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `User with this email or phone number is already exist please try with different  email or phone number ` })
        }
        console.log("Something went wrong while saving to DB", err);
        res.status(500).json({message:err.message,status:"ERROR"})
    }
} 

async function UpdateSubMatterEx(req,res){
    try{
    
        const ID = req.params.subMatterExId;
        // console.log(req.body)
        const savedSubMatterEx = await subMatterEx.findOne({_id:ID});
        if (!savedSubMatterEx){
            return res.status(404).json({message: "subMatterEx Not found"});
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
        return res.status(202).json({ updateSubMatterEx,message: "subMatterEx  Updated Successfully"})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `subMatterEx with this email or phone number is already exist please try with different  email or phone number ` })
        }
        console.log(err)
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function getAllSubMatterEx(req,res){
    try{
        const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
        const pageSize = 10; // Number of items per page
        
        subMatterEx.paginate({}, { page: pageNumber, limit: pageSize }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error occurred while fetching Data.' });
        }
        
        const { docs, total, limit, page, pages } = result;
        res.json({ subMatterEx: docs, total, limit, page, pages });
        });
    }catch(err){
        res.status(500).json({message: err.message, status:`ERROR`});
    }
}


async function DeleteSubMatterEx(req,res){
    try{
        const savedSubMatterEx= await subMatterEx.findOne({_id:req.params.subMatterExId})
        if (!savedSubMatterEx){
            return res.status(404).json({message: "subMatterEx Not found"});
        }
        await subMatterEx.deleteOne({_id:req.params.subMatterExId})
        res.status(200).json({ message: `subMatterEx  Deleted Successfully with ID: ${req.params.Id}`})
    }catch(err){
        res.status(500).json({message: err.message,status:"ERROR" });
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
    res.status(404).json({message: err.message, status:`ERROR`});
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
        
        res.status(200).json({totalSubMatterEx})
    }catch(err){
        res.status(500).json({message:err.message,status:`ERROR` })
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
        res.status(200).json({label:`totalSubMatterExReport`,Data})
    }catch(err){
        res.status(500).json({message:err.message,status:`ERROR` })
    }
}

async function getAllSubMatterExNotification(req,res){
    try{
        const savedSubMatterEx = await subMatterEx.findOne({_id:req.params.userID});
        if (!savedSubMatterEx){
            return res.status(404).json({message: "SubMatterEx Not found"});
        }
        const message = await Notification.find({userID:req.params.userID})
        return res.status(404).json({count:message.length ,messages:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
    }
    
async function getSubMatterExNotification(req,res){
    try{
        const savedSubMatterEx = await subMatterEx.findOne({_id:req.params.userID});
        if (!savedSubMatterEx){
            return res.status(404).json({message: "SubMatterEx Not found"});
        }
        const message = await Notification.findOne({_id:req.params.msgID})
        return res.status(404).json({count:message.length ,messages:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
    }
    
async function deleteSubMatterExNotification(req,res){
    try{
        const savedSubMatterEx = await subMatterEx.findOne({_id:req.params.userID});
        if (!savedSubMatterEx){
            return res.status(404).json({message: "SubMatterEx Not found"});
        }
        const savedNotification = await Notification.findOne({_id:req.params.msgID})
        if (!savedNotification){
            return res.status(404).json({message: "message Not found"});
        }
        await savedNotification.deleteOne({_id:req.params.msgID});
        return res.status(202).json({ message: `Notification  deleted Successfully with Notification ID: ${req.params.msgID}`})
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
    }


module.exports={
    postSubMatterEx,
    UpdateSubMatterEx,
    getAllSubMatterEx,
    DeleteSubMatterEx,
    subMatterExSearchOption,
    totalSubMatterEx,
    totalSubMatterExReport,
    getAllSubMatterExNotification,
    getSubMatterExNotification,
    deleteSubMatterExNotification
}