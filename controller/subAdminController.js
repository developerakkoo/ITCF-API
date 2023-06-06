const subAdmin = require('../models/subAdmin.model');
const Player =  require('../models/player.mode');
const Team =  require('../models/Team.model');
const TeamAdmin = require('../models/TeamAdmin.model');
const associateMember =require('../models/associateMember.model');
const subMatterEx =  require('../models/subMatterEx.model');
const Notification = require('../models/Notification.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const APIFeatures = require('../utils/ApiFeature');
require('dotenv').config();

let msg = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
    }
});

const postSignup = async (req, res, next) => {
    const email = req.body.email;
    const Phone = req.body.Phone;
    const password = req.body.password;
    const SubAdmin = await subAdmin.findOne({ email: email})
        if(SubAdmin){
            return res.status(400).json({
            status: false,
            message: 'Sub Admin With This Email Already Exists'
        })
        }
        bcrypt.hash(password, 12)
        .then(async (hashedPasswords) => {
            const admin = new subAdmin({
                email: email,
                password: hashedPasswords,
                Phone:Phone
            });

            const createdSubAdmin = await admin.save();
            let mailOptions = {
                from: 'serviceacount.premieleague@gmail.com',
                to: createdSubAdmin.email,
                subject:'welcome ' ,
                text:`You'r successfully Register As Sub Admin`
            };
            msg.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
            return createdSubAdmin ;
        }).then((result) => {
            return res.status(201).json({message: 'Sub Admin Created Successfully!', status: '201', userId: result._id});
        })
    
.catch(error =>{
    if(error.code == 11000){
        return res.status(500).json({message: `Sub Admin With This Information Is Already Exist Please Try With Another Email Or Mobile Number` })
    }
    console.log(error)
    return res.status(400).json({message: error.message, status:'error'});
    })
}

const postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const SubAdmin = await subAdmin.findOne({ email: email})
        if(!SubAdmin){
            const error = new Error('Sub Admin Not Found');
            error.status = 404;
            next(error);
        }
        loadedUser = SubAdmin;
        bcrypt.compare(password, SubAdmin.password)
        .then(doMatch => {
            if(!doMatch){
                const error = new Error('Password Do Not Match');
                error.status = 401;
                next(error);
            }
            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id,
            },process.env.SECRET_KEY, {expiresIn: '3h'});
            const  postResponse={   
                token: token,
                userId: loadedUser._id.toString()
            }
            res.status(200).json({message: 'Sign In Successful',postResponse})
        })
        .catch(error =>{
        console.log(error)
        res.status(400).json({message: error.message, status:'error'});
    })
}

async function UpdateSubAdmin(req,res){
    try{
        const ID = req.params.subAdminId;
        // console.log(req.body)
        const savedSubAdmin = await subAdmin.findOne({_id:ID});
        if (!savedSubAdmin){
            return res.status(400).json({message: "Sub Admin Not Found"});
        }
        savedSubAdmin.email=req.body.email ? req.body.email : savedSubAdmin.email;  
        savedSubAdmin.Phone=req.body.Phone ? req.body.Phone : savedSubAdmin.Phone;
        savedSubAdmin.isBlocked=req.body.isBlocked ? req.body.isBlocked : savedSubAdmin.isBlocked;

        const updateSubAdmin = await savedSubAdmin.save()

        return res.status(200).json({ updateSubAdmin,message: "Sub Admin  Updated Successfully"})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Sub Admin With This Email Or Phone Number  Is Already Exist Please Try With Different  Email Or Phone Number ` })
        }
        console.log(err)
        res.status(500).json({message: err.message,status:`ERROR`});
    }
}

async function subAdminSearchOption (req, res, next) {

    try {
        const query = req.query.query;
        const term = req.query.term;
        console.log(query + term);
        const features = await new APIFeatures(subAdmin.find() .lean().populate('subAdminID','email') .lean().populate('subAdminID' ,'email'), req.query)
        .filter()
        .sort()

        const SubAdmins = await features.query;

        res.status(200).json({
        status: "success",
        statusCode: 200,
        results: SubAdmins.length,
        searchData: SubAdmins,
        });
    } catch (err) {
        console.log(err)
    res.status(404).json({message: err.message, status:`ERROR`});
    }
};

async function DeleteSubAdmin(req,res){
    try{
        const savedSubAdmin= await subAdmin.findOne({_id:req.params.subAdminId})
        if (!savedSubAdmin){
            return res.status(400).json({message: "Sub Admin Not Found"});
        }
        await subAdmin.deleteOne({_id:req.params.subAdminId})
        res.status(200).json({ message: `Sub Admin  Deleted Successfully With ID: ${req.params.subAdminId}`})
    }catch(err){
        res.status(500).json({message: err.message,status:"ERROR" });
    }
}

async function getAllSubAdminNotification(req,res){
    try{
        const savedSubAdmin = await subAdmin.findOne({_id:req.params.userID});
        if (!savedSubAdmin){
            return res.status(404).json({message: "Sub Admin Not Found"});
        }
        const message = await Notification.find({userID:req.params.userID});
        if(!message){
            return res.status(400).json({message:"Message  Not Found"});
        
        }
        return res.status(200).json({count:message.length ,messages:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
    }
    
async function getSubAdminNotification(req,res){
    try{
        const savedSubAdmin = await subAdmin.findOne({_id:req.params.userID});
        if (!savedSubAdmin){
            return res.status(404).json({message: "Sub Admin Not Found"});
        }
        const message = await Notification.findOne({_id:req.params.msgID})
        if(!message){
            return res.status(400).json({message:"Message  Not Found"});
        
        }
        return res.status(404).json({count:message.length ,messages:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
    }
    
async function deleteSubAdminNotification(req,res){
    try{
        const savedSubAdmin = await subAdmin.findOne({_id:req.params.userID});
        if (!savedSubAdmin){
            return res.status(404).json({message: "Sub Admin Not Found"});
        }
        const savedNotification = await Notification.findOne({_id:req.params.msgID})
        if (!savedNotification){
            return res.status(404).json({message: "message Not found"});
        }
        await savedNotification.deleteOne({_id:req.params.msgID});
        return res.status(202).json({ message: `Notification  Deleted Successfully With Notification ID: ${req.params.msgID}`})
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
    }


    async function  signUpTeamAdminBySubAdmin(req,res){
        const ID =req.params.Id;
    try{
        
            const AdminUserObj ={
                subAdminID:ID,
                UID:req.body.fName.split('')[0]+req.body.lName.split('')[0]+Math.ceil(Math.random() * 100000+1984567),
                fName: req.body.fName,
                lName: req.body.lName,
                age: req.body.age,
                DOB:req.body.DOB,
                Skills: req.body.Skills,
                Phone: req.body.Phone,
                email: req.body.email
                }
        const admin = await TeamAdmin.findOne({email:req.body.email});
        if(admin){
        return res.status(400).json({message: `Team Admin Already Exist With This Email Adders Please Try With Different Email Address ${req.body.email}`})
        }
        const TeamAdminCreated = await TeamAdmin.create(AdminUserObj)
        const postResponse={
            subAdminID:TeamAdminCreated.subAdminID,
            fName:TeamAdminCreated.fName,
            lName:TeamAdminCreated.lName,
            Phone:TeamAdminCreated.Phone,
            email:TeamAdminCreated.email,
            age:TeamAdminCreated.age,
            DOB:TeamAdminCreated.DOB,
            Skills:TeamAdminCreated.Skills,
        }
        const id = TeamAdminCreated.UID
        let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: TeamAdminCreated.email,
            subject:'Your Unique User ID ' ,
            text:`Dear ${TeamAdminCreated.fName}, Sub Admin Register You As A Team Admin, For Login Use This UID: ${id}`
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        res.status(201).json({message: `Team Admin Created Successfully UID Is Send To Your Register Email Address`,postResponse})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Team Admin With This Email Or Phone Number  Is Already Exist Please Try With Different  Email Or Phone Number ` })
        }
        console.log("Something went wrong while saving to DB", err);
        res.status(500).json({message:err.message,status:`ERROR`})
    }
    }
    
    async function signUpAssociateMemberBySubAdmin(req,res){
        // console.log("AddDetails")
        // console.log("data>>",req.files.PANCard[0].path)
        const ID =req.params.Id;
        const userObj = {
            subAdminID:ID,
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
        try{
            const AssociateMemberCreated = await associateMember.create(userObj)
            let mailOptions = {
                from: 'serviceacount.premieleague@gmail.com',
                to: AssociateMemberCreated.email,
                subject:'welcome ' ,
                text:`Dear ${AssociateMemberCreated.fName}, Sub Admin Register You As A Associate Member`
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
    
    async function  signUpTeamBySubAdmin(req,res){
        // console.log(">>>>>>",req.body)
    const teamObj ={
        subAdminID:req.params.Id,
        teamAdminUID:req.body.teamAdminUID,
        AdminID: req.body.AdminID,
        teamName: req.body.teamName,
        teamCity: req.body.teamCity
    }
    try{
        const admin = await TeamAdmin.findOne({UID:req.body.teamAdminUID});
        if(!admin){
        return res.status(400).json({message: `Team Admin UID Is Not Valid`})
        }
        const savedAdmin = await TeamAdmin.findOne({_id:teamObj.AdminID});
        if(!savedAdmin){
        return res.status(400).json({message: `Team Admin  Is Not Valid`})
        }
        const savedTeam = await Team.findOne({teamName:req.body.teamName});
        if(savedTeam){
        return res.status(400).json({message: `Team Name Already Exist With Please Try With Different Team Name`})
        }
        const TeamACreated = await Team.create(teamObj)
        res.status(201).json({message: `Team  created Successfully `,TeamACreated})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Team With This Team Name Is Already Exist Please Try With Different  Team Name` })
        }
        console.log("Something went wrong while saving to DB", err);
        res.status(500).json({message:err.message,status:"ERROR"})
    }
    }
    
    async function signUpMatterExBySubAdmin(req,res){
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
            subAdminID:req.params.Id,
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
            return res.status(400).json({message: `Subject Matter Expert With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number `})
            }
            const UserCreated = await subMatterEx.create(dataObj)
            let mailOptions = {
                from: 'serviceacount.premieleague@gmail.com',
                to: UserCreated.email,
                subject:'welcome ' ,
                text:`Dear, ${UserCreated.Name} sub Admin Register you as a subject Matter Expert`
            };
            msg.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
            return res.status(201).json({message: `subject Matter Expert Created Successfully`,UserCreated})
        }catch(err){
            if(err.code == 11000){
                return res.status(400).json({message: `subject Matter Expert With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number ` })
            }
            console.log("Something went wrong while saving to DB", err);
            res.status(500).json({message:err.message,status:"ERROR"})
        }
    } 
    
    async function  singUpPlayerBySubAdmin(req,res){
        // console.log(">>>>>>",req.body)
    const playerObj ={
        subAdminID:req.params.Id,
        teamAdminUID:req.body.teamAdminUID,
        AdminID: req.body.AdminID,
        teamID: req.body.teamID,
        Name: req.body.Name,
        age: req.body.age,
        DOB: req.body.DOB,
        email: req.body.email,
        Phone: req.body.Phone,
        Skills: req.body.Skills,
    }
    try{
        const admin = await TeamAdmin.findOne({UID:req.body.teamAdminUID});
        if(!admin){
        return res.status(400).json({message: `Team Admin UID Is Not Valid`})
        }
        const savedAdmin = await TeamAdmin.findOne({UID:req.body.teamAdminUID});
        if(!savedAdmin){
        return res.status(400).json({message: `Team Admin  Is Not Valid`})
        }
        const savedTeam = await Team.findOne({_id:req.body.teamID});
        if(!savedTeam){
        return res.status(400).json({message: `Team Does Not Exist With This Team Name`})
        }
        const playerCreated = await Player.create(playerObj)
        let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: playerCreated.email,
            subject:'welcome ' ,
            text:`Dear, ${playerCreated.Name} Sub Admin register you as a Player`
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        return res.status(201).json({message: `Player Created Successfully`,playerCreated})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Player With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number ` })
        }
        console.log("Something went wrong while saving to DB", err);
        res.status(500).json({message:err.message,status:"ERROR"})
    }
    }
    
    async function subAdminUpdateNotification(req,res){
        try{
            const savedNotification = await Notification.findOne({_id:req.params.notificationId});
            if(!savedNotification){
                return res.status(404).json({message: "Message Not found"});
            }
            savedNotification.message=req.body.message ? req.body.message : savedNotification.message;
            const updateNotification= await savedNotification.save();
            return res.status(202).json({ message: "Message  Updated Successfully",updateNotification})
        }catch(err){
            res.status(500).json({message: err.message,Status:`ERROR`});
        }
    }

    async function sendNotificationBySubAdmin(req,res){
        try{
            const userObj={
                superAdminID:req.params.Id,
                userID:req.body.Id,
                message:req.body.message
            }
            const msg = await Notification.create(userObj);
            return res.status(201).json({message: `Notification Send To User Successfully `,msg})
        }catch(err){
            res.status(500).json({message:err.message,status:"ERROR"})
        }
    }

    const postSignupBySubAdmin = async (req, res, next) => {
        const subAdminID=req.params.Id;
        const email = req.body.email;
        const Phone = req.body.Phone;
        const password = req.body.password;
        const SubAdmin = await subAdmin.findOne({ email: email})
            if(SubAdmin){
                return res.status(400).json({
                status: false,
                message: 'Sub Admin With Email Already Exists'
            })
            }
            bcrypt.hash(password, 12)
            .then(async (hashedPasswords) => {
                const admin = new subAdmin({
                    subAdminID:subAdminID,
                    email: email,
                    password: hashedPasswords,
                    Phone:Phone
                });
    
                const createdSubAdmin = await admin.save();
                let mailOptions = {
                    from: 'serviceacount.premieleague@gmail.com',
                    to: createdSubAdmin.email,
                    subject:'welcome ' ,
                    text:`You'r Successfully Register As Sub Admin`
                };
                msg.sendMail(mailOptions, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    console.log('Email sent: ' + info.response);
                    }
                });
                return createdSubAdmin ;
            }).then((result) => {
                return res.status(201).json({message: 'Sub Admin Created Successfully!', status: '201', userId: result._id});
            })
        
    .catch(error =>{
        if(error.code == 11000){
            return res.status(500).json({message: `Sub Admin With This Information Is Already Exist Please Try With Another Email Or Mobile Number` })
        }
        console.log(error)
        return res.status(400).json({message: error.message, status:'ERROR'});
        })
    }

    async function UpdateSubAdminBySubAdmin(req,res){
        try{
            const ID = req.params.subAdminId;
            // console.log(req.body)
            const savedSubAdmin = await subAdmin.findOne({_id:ID});
            if (!savedSubAdmin){
                return res.status(400).json({message: "Sub Admin Not found"});
            }
            savedSubAdmin.email = req.body.email != undefined
            ? req.body.email
            : savedSubAdmin.email
    
            savedSubAdmin.Phone = req.body.Phone != undefined
            ? req.body.Phone
            : savedSubAdmin.Phone
        /*Sub Admin Access*/
        savedSubAdmin.canCreateSubAdmin = req.body.canCreateSubAdmin != undefined
        ? req.body.canCreateSubAdmin
        : savedSubAdmin.canCreateSubAdmin

        savedSubAdmin.canUpdateSubAdmin = req.body.canUpdateSubAdmin != undefined
        ? req.body.canUpdateSubAdmin
        : savedSubAdmin.canUpdateSubAdmin

        savedSubAdmin.canNotifySubAdmin = req.body.canNotifySubAdmin != undefined
        ? req.body.canNotifySubAdmin
        : savedSubAdmin.canNotifySubAdmin

        savedSubAdmin.canGetSubAdmin = req.body.canGetSubAdmin != undefined
        ? req.body.canGetSubAdmin
        : savedSubAdmin.canGetSubAdmin

        savedSubAdmin.canDeleteSubAdmin = req.body.canDeleteSubAdmin != undefined
        ? req.body.canDeleteSubAdmin
        : savedSubAdmin.canDeleteSubAdmin

        savedSubAdmin.canBlockSubAdmin = req.body.canBlockSubAdmin != undefined
        ? req.body.canBlockSubAdmin
        : savedSubAdmin.canBlockSubAdmin
        
        /*Team Admin Access*/
        savedSubAdmin.canCreateTeamAdmin = req.body.canCreateTeamAdmin != undefined
        ? req.body.canCreateTeamAdmin
        : savedSubAdmin.canCreateTeamAdmin

        savedSubAdmin.canUpdateTeamAdmin = req.body.canUpdateTeamAdmin != undefined
        ? req.body.canUpdateTeamAdmin
        : savedSubAdmin.canUpdateTeamAdmin

        savedSubAdmin.canNotifyTeamAdmin = req.body.canNotifyTeamAdmin != undefined
        ? req.body.canNotifyTeamAdmin
        : savedSubAdmin.canNotifyTeamAdmin

        savedSubAdmin.canGetTeamAdmin = req.body.canGetTeamAdmin != undefined
        ? req.body.canGetTeamAdmin
        : savedSubAdmin.canGetTeamAdmin

        savedSubAdmin.canDeleteTeamAdmin = req.body.canDeleteTeamAdmin != undefined
        ? req.body.canDeleteTeamAdmin
        : savedSubAdmin.canDeleteTeamAdmin

        savedSubAdmin.canBlockTeamAdmin = req.body.canBlockTeamAdmin != undefined
        ? req.body.canBlockTeamAdmin
        : savedSubAdmin.canBlockTeamAdmin

        /*Team  Access*/
        savedSubAdmin.canCreateTeam = req.body.canCreateTeam != undefined
        ? req.body.canCreateTeam
        : savedSubAdmin.canCreateTeam

        savedSubAdmin.canUpdateTeam = req.body.canUpdateTeam != undefined
        ? req.body.canUpdateTeam
        : savedSubAdmin.canUpdateTeam

        savedSubAdmin.canNotifyTeam = req.body.canNotifyTeam != undefined
        ? req.body.canNotifyTeam
        : savedSubAdmin.canNotifyTeam

        savedSubAdmin.canGetTeam = req.body.canGetTeam != undefined
        ? req.body.canGetTeam
        : savedSubAdmin.canGetTeam

        savedSubAdmin.canDeleteTeam = req.body.canDeleteTeam != undefined
        ? req.body.canDeleteTeam
        : savedSubAdmin.canDeleteTeam

        savedSubAdmin.canBlockTeam = req.body.canBlockTeam != undefined
        ? req.body.canBlockTeam
        : savedSubAdmin.canBlockTeam
        
        /*Player Access*/
        savedSubAdmin.canCreatePlayer = req.body.canCreatePlayer != undefined
        ? req.body.canCreatePlayer
        : savedSubAdmin.canCreatePlayer

        savedSubAdmin.canUpdatePlayer = req.body.canUpdatePlayer != undefined
        ? req.body.canUpdatePlayer
        : savedSubAdmin.canUpdatePlayer

        savedSubAdmin.canNotifyPlayer = req.body.canNotifyPlayer != undefined
        ? req.body.canNotifyPlayer
        : savedSubAdmin.canNotifyPlayer

        savedSubAdmin.canGetPlayer = req.body.canGetPlayer != undefined
        ? req.body.canGetPlayer
        : savedSubAdmin.canGetPlayer

        savedSubAdmin.canDeletePlayer = req.body.canDeletePlayer != undefined
        ? req.body.canDeletePlayer
        : savedSubAdmin.canDeletePlayer

        savedSubAdmin.canBlockPlayer = req.body.canBlockPlayer != undefined
        ? req.body.canBlockPlayer
        : savedSubAdmin.canBlockPlayer
        
        /*SubMatterEx Access*/
        savedSubAdmin.canCreateSubMatterEx = req.body.canCreateSubMatterEx != undefined
        ? req.body.canCreateSubMatterEx
        : savedSubAdmin.canCreateSubMatterEx

        savedSubAdmin.canUpdateSubMatterEx = req.body.canUpdateSubMatterEx != undefined
        ? req.body.canUpdateSubMatterEx
        : savedSubAdmin.canUpdateSubMatterEx

        savedSubAdmin.canNotifySubMatterEx = req.body.canNotifySubMatterEx != undefined
        ? req.body.canNotifySubMatterEx
        : savedSubAdmin.canNotifySubMatterEx

        savedSubAdmin.canGetSubMatterEx = req.body.canGetSubMatterEx != undefined
        ? req.body.canGetSubMatterEx
        : savedSubAdmin.canGetSubMatterEx

        savedSubAdmin.canDeleteSubMatterEx = req.body.canDeleteSubMatterEx != undefined
        ? req.body.canDeleteSubMatterEx
        : savedSubAdmin.canDeleteSubMatterEx

        savedSubAdmin.canBlockSubMatterEx = req.body.canBlockSubMatterEx != undefined
        ? req.body.canBlockSubMatterEx
        : savedSubAdmin.canBlockSubMatterEx
        
        /*AssociateMember Access*/
        
        savedSubAdmin.canCreateAssociateMember = req.body.canCreateAssociateMember != undefined
        ? req.body.canCreateAssociateMember
        : savedSubAdmin.canCreateAssociateMember

        savedSubAdmin.canUpdateAssociateMember = req.body.canUpdateAssociateMember != undefined
        ? req.body.canUpdateAssociateMember
        : savedSubAdmin.canUpdateAssociateMember

        savedSubAdmin.canNotifyAssociateMember = req.body.canNotifyAssociateMember != undefined
        ? req.body.canNotifyAssociateMember
        : savedSubAdmin.canNotifyAssociateMember

        savedSubAdmin.canGetAssociateMember = req.body.canGetAssociateMember != undefined
        ? req.body.canGetAssociateMember
        : savedSubAdmin.canGetAssociateMember

        savedSubAdmin.canDeleteAssociateMember = req.body.canDeleteAssociateMember != undefined
        ? req.body.canDeleteAssociateMember
        : savedSubAdmin.canDeleteAssociateMember

        savedSubAdmin.canBlockAssociateMember = req.body.canBlockAssociateMember != undefined
        ? req.body.canBlockAssociateMember
        : savedSubAdmin.canBlockAssociateMember
        
            const updateSubAdmin = await savedSubAdmin.save()
    
            return res.status(200).json({ updateSubAdmin,message: "Sub Admin  Updated Successfully"})
        }catch(err){
            if(err.code == 11000){
                return res.status(400).json({message: `Sub Admin With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number` })
            }
            console.log(err)
            res.status(500).json({message: err.message,status:`ERROR`});
        }
    }
module.exports = {
    subAdminUpdateNotification,
    postSignup,
    postLogin,
    UpdateSubAdmin,
    DeleteSubAdmin,
    subAdminSearchOption,
    getAllSubAdminNotification,
    getSubAdminNotification,
    deleteSubAdminNotification,
    signUpTeamAdminBySubAdmin,
    signUpAssociateMemberBySubAdmin,
    signUpTeamBySubAdmin,
    signUpMatterExBySubAdmin,
    singUpPlayerBySubAdmin,
    sendNotificationBySubAdmin,
    postSignupBySubAdmin,
    UpdateSubAdminBySubAdmin
}