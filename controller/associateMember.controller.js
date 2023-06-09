const associateMember =require('../models/associateMember.model');
const Notification = require('../models/Notification.model');
const APIFeatures =require('../utils/ApiFeature');
const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');
const ejs = require('ejs');

let msg = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
    }
});

async function postAssociateMember(req,res){
    // console.log("AddDetails")
    // console.log("data>>",req.files.PANCard[0].path)
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
    try{
        const AssociateMemberCreated = await associateMember.create(userObj);
        const template = fs.readFileSync('associateMember.ejs', 'utf-8');
        const renderedTemplate = ejs.render(template, {name: AssociateMemberCreated.fName});
        let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: AssociateMemberCreated.email,
            subject:'WELCOME TO THE ITCF FAMILY ' ,
            html: renderedTemplate
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).json({message:`Associate Member Created Successfully`,AssociateMemberCreated})
    }catch(err){
        console.log(err)
        if(err.code == 11000){
            return res.status(500).json({message: `Associate Member With This Information Is Already Exist Please Try With Another Name Or Mobile Number` })
        }
        res.status(500).json({message:err.message,status:`ERROR`});
    }
    
}

async function uploadPan(req,res){
    try{
        const file = req.protocol +"://"+req.hostname +"/"+ req.file.path.replace(/\\/g, "/");
        const savedAssociateMember =  await associateMember.findOne({_id:req.params.id});
        if(!savedAssociateMember){
            return res.status(400).json({message:`Associate Member Not Found with ID:${req.params.id} `});
        }
        savedAssociateMember.panCard = file != undefined
        ? file
        : savedAssociateMember.panCard

        const updatedUser = await savedAssociateMember.save();
        res.status(201).json({message:"Associate Member Pan updated",updatedUser});
    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message,status:`ERROR`});
    }
}


async function uploadAdhar(req,res){
    try{
        const file = req.protocol +"://"+req.hostname +"/"+ req.file.path.replace(/\\/g, "/");
        const savedAssociateMember =  await associateMember.findOne({_id:req.params.id});
        if(!savedAssociateMember){
            return res.status(400).json({message:`Associate Member Not Found with ID:${req.params.id} `});
        }
        savedAssociateMember.AdharCard = file != undefined
        ? file
        : savedAssociateMember.AdharCard

        const updatedUser = await savedAssociateMember.save();
        res.status(201).json({message:"Associate Member AdharCard updated",updatedUser});
    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message,status:`ERROR`});
    }
}

async function uploadResidentialProof(req,res){
    try{

        const file = req.protocol +"://"+req.hostname +"/"+ req.file.path.replace(/\\/g, "/");
        
        
        const savedAssociateMember =  await associateMember.findOne({_id:req.params.id});
        if(!savedAssociateMember){
            return res.status(400).json({message:`Associate Member Not Found with ID:${req.params.id} `});
        }
        savedAssociateMember.residentialProof = file != undefined
        ? file
        : savedAssociateMember.residentialProof

        const updatedUser = await savedAssociateMember.save();
        res.status(201).json({message:"Associate Member Pan updated",updatedUser});
    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message,status:`ERROR`});
    }
}

async function uploadITR(req,res){
    try{
        
        const file = req.protocol +"://"+req.hostname +"/"+ req.file.path.replace(/\\/g, "/")
        
        
        const savedAssociateMember =  await associateMember.findOne({_id:req.params.id});
        if(!savedAssociateMember){
            return res.status(400).json({message:`Associate Member Not Found with ID:${req.params.id} `});
        }
        savedAssociateMember.ITR = file!= undefined
        ? file
        : savedAssociateMember.ITR

        const updatedUser = await savedAssociateMember.save();
        res.status(201).json({message:"Associate Member Pan updated",updatedUser});
    }catch(error){
        console.log(error);
        res.status(500).json({message:error.message,status:`ERROR`});
    }
}


async function UpdateAssociateMember(req,res){
    try{
        const ID = req.params.associateMemberId;
        // console.log(req.body)
        const savedAssociateMembers = await associateMember.findOne({_id:ID});
        if (!savedAssociateMembers){
            return res.status(404).json({message: "Associate Member Not Found"});
        }
        savedAssociateMembers.fName=req.body.fName ? req.body.fName : savedAssociateMembers.fName;
        savedAssociateMembers.mName=req.body.mName ? req.body.mName : savedAssociateMembers.mName;
        savedAssociateMembers.lName=req.body.lName ? req.body.lName : savedAssociateMembers.lName;
        savedAssociateMembers.age=req.body.age ? req.body.age : savedAssociateMembers.age;
        savedAssociateMembers.DOB=req.body.DOB ? req.body.DOB : savedAssociateMembers.DOB;
        savedAssociateMembers.email=req.body.email ? req.body.email : savedAssociateMembers.email;  
        savedAssociateMembers.Phone=req.body.Phone ? req.body.Phone : savedAssociateMembers.Phone;
        savedAssociateMembers.OfficeAddress=req.body.OfficeAddress ? req.body.OfficeAddress : savedAssociateMembers.OfficeAddress;
        savedAssociateMembers.ResidentialAddress=req.body.ResidentialAddress ? req.body.ResidentialAddress : savedAssociateMembers.ResidentialAddress;
        savedAssociateMembers.CricketingExperience=req.body.CricketingExperience ? req.body.CricketingExperience : savedAssociateMembers.CricketingExperience;
        savedAssociateMembers.isBlocked=req.body.isBlocked ? req.body.isBlocked : savedAssociateMembers.isBlocked;
        const updatedAssociateMembers= await savedAssociateMembers.save()
        return res.status(202).json({ updatedAssociateMembers,message: "Associate Members  Updated Successfully"})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Associate Member With This Information Is Already Exist Please Try With Another Name Or Mobile Number` })
        }
        console.log(err)
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function getAllAssociateMember(req,res){
    try{
        const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
        const pageSize = 10; // Number of items per page
        
        associateMember.paginate({}, { page: pageNumber, limit: pageSize }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error occurred while fetching Data.' });
        }
        
        const { docs, total, limit, page, pages } = result;
        res.json({ associateMember: docs, total, limit, page, pages });
        });
    }catch(err){
        res.status(500).json({message: err.message, status:`ERROR`});
    }
}


async function DeleteAssociateMember(req,res){
    try{
        const savedAssociateMember= await associateMember.findOne({_id:req.params.associateMemberId})
        if (!savedAssociateMember){
            return res.status(404).json({message: "Associate Member Not Found"});
        }
        await associateMember.deleteOne({_id:req.params.associateMemberId})
        res.status(200).json({ message: `Associate Member  Deleted Successfully With ID: ${req.params.associateMemberId}`})
    }catch(err){
        res.status(500).json({message: err.message,status:"ERROR" });
    }
}


async function getAllAssociateMemberNotification(req,res){
try{
    const savedAssociateMembers = await associateMember.findOne({_id:req.params.userID});
    if (!savedAssociateMembers){
        return res.status(404).json({message: "Associate Member Not Found"});
    }
    
    const message = await Notification.find({userID:req.params.userID})
    return res.status(404).json({count: message.length ,Notification:message});
}catch(err){
    res.status(500).json({message: err.message,Status:`ERROR`});
}
}

async function getAssociateMemberNotification(req,res){
    try{
        const savedAssociateMembers = await associateMember.findOne({_id:req.params.userID});
        if (!savedAssociateMembers){
            return res.status(404).json({message: "Associate Member Not Found"});
        }
        const message = await Notification.findOne({_id:req.params.msgID})
        return res.status(404).json({Notification:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
    }

async function deleteAssociateMemberNotification(req,res){
    try{
        const savedAssociateMembers = await associateMember.findOne({_id:req.params.userID});
        if (!savedAssociateMembers){
            return res.status(404).json({message: "Associate Member Not Found"});
        }
        const savedNotification = await Notification.findOne({_id:req.params.msgID})
        if (!savedNotification){
            return res.status(404).json({message: "message Not Found"});
        }
        await savedNotification.deleteOne({_id:req.params.msgID});
        return res.status(202).json({ message: `Notification  Deleted Successfully With Notification ID: ${req.params.msgID}`})
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function AssociateMemberSearchOption (req, res, next) {

    try {
        const query = req.query.query;
        const term = req.query.term;
        console.log(query + term);
        const features = await new APIFeatures(associateMember.find().lean().populate('superAdminID' ,'email') .lean().populate('subAdminID' ,'email'), req.query)
        .filter()
        .sort()

        const associateMembers = await features.query;

        res.status(200).json({
        status: "success",
        statusCode: 200,
        results: associateMembers.length,
        searchData: associateMembers,
        });
    } catch (err) {
        console.log(err)
    res.status(404).json({message: err.message, status:`ERROR`});
    }
};

async function totalAssociateMember(req,res){
    const pipeline =[
        [
            {
            '$count': 'totalAssociateMember'
            }
        ]
    ]
    try{
        const totalAssociateMember = await associateMember.aggregate(pipeline);
        
        res.status(200).json({message:`totalAssociateMember`,totalAssociateMember})
    }catch(err){
        res.status(500).json({message:err.message,status:`ERROR` })
    }
}

async function totalAssociateMemberReport(req,res){
    const pipeline =[
        [
            {
            '$count': 'totalAssociateMember'
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
                        '_id': 'total Active AssociateMember', 
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
                        '_id': 'total Blocked AssociateMember', 
                        'value': {
                        '$count': {}
                        }
                    }
                }
        ]
    ]
    try{
        const count = await associateMember.aggregate(pipeline);
        const isActive = await associateMember.aggregate(pipeline1);
        const isBlocked = await associateMember.aggregate(pipeline2);

        let Data = [count[0],isActive[0],isBlocked[0]]
        res.status(200).json({label:`totalAssociateMemberReport`,Data})
    }catch(err){
        res.status(500).json({message:err.message,status:`ERROR` })
    }
}


module.exports={
    postAssociateMember,
    uploadPan,
    uploadAdhar,
    uploadITR,
    uploadResidentialProof,
    UpdateAssociateMember,
    getAllAssociateMember,
    DeleteAssociateMember,
    AssociateMemberSearchOption,
    totalAssociateMember,
    totalAssociateMemberReport,
    deleteAssociateMemberNotification,
    getAssociateMemberNotification,
    getAllAssociateMemberNotification
}