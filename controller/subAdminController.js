const subAdmin = require('../models/subAdmin.model');
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
            message: 'SubAdmin with email Already Exists'
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
                text:`You'r successfully register as sub Admin`
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
            return res.status(201).json({message: 'Admin Created Successfully!', status: '201', userId: result._id});
        })
    
.catch(error =>{
    if(error.code == 11000){
        return res.status(500).json({message: `user with this information is already exist please try with another email or Mobile Number` })
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
            const error = new Error('Admin not found');
            error.status = 404;
            next(error);
        }
        loadedUser = SubAdmin;
        bcrypt.compare(password, SubAdmin.password)
        .then(doMatch => {
            if(!doMatch){
                const error = new Error('Password do not match');
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
            return res.status(400).json({message: "User Not found"});
        }
        savedSubAdmin.email=req.body.email ? req.body.email : savedSubAdmin.email;  
        savedSubAdmin.Phone=req.body.Phone ? req.body.Phone : savedSubAdmin.Phone;
        savedSubAdmin.isBlocked=req.body.isBlocked ? req.body.isBlocked : savedSubAdmin.isBlocked;

        const updateSubAdmin = await savedSubAdmin.save()

        return res.status(200).json({ updateSubAdmin,message: "SubAdmin  Updated Successfully"})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `User with this email or phone number  is already exist please try with different  email or phone number ` })
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
            return res.status(400).json({message: "SubAdmin Not found"});
        }
        await subAdmin.deleteOne({_id:req.params.subAdminId})
        res.status(200).json({ message: `SubAdmin  Deleted Successfully with ID: ${req.params.Id}`})
    }catch(err){
        res.status(500).json({message: err.message,status:"ERROR" });
    }
}

async function getAllSubAdminNotification(req,res){
    try{
        const savedSubAdmin = await subAdmin.findOne({_id:req.params.userID});
        if (!savedSubAdmin){
            return res.status(404).json({message: "subAdmin Not found"});
        }
        const message = await Notification.find({userID:req.params.userID})
        return res.status(404).json({count:message.length ,messages:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
    }
    
async function getSubAdminNotification(req,res){
    try{
        const savedSubAdmin = await subAdmin.findOne({_id:req.params.userID});
        if (!savedSubAdmin){
            return res.status(404).json({message: "subAdmin Not found"});
        }
        const message = await Notification.findOne({_id:req.params.msgID})
        return res.status(404).json({count:message.length ,messages:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
    }
    
async function deleteSubAdminNotification(req,res){
    try{
        const savedSubAdmin = await subAdmin.findOne({_id:req.params.userID});
        if (!savedSubAdmin){
            return res.status(404).json({message: "subAdmin Not found"});
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
        return res.status(400).json({message: `user already exist with email adders!${req.body.email}`})
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
            text:`Dear ${TeamAdminCreated.fName}, subAdmin register you as a team admin, for login use this UID: ${id}`
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        res.status(201).json({message: `Team Admin created Successfully UID is send to register email!`,postResponse})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `User with this email or phone number  is already exist please try with different  email or phone number ` })
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
                text:`Dear ${AssociateMemberCreated.fName}, subAdmin register you as a AssociateMember`
            };
            msg.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
    
            res.status(201).json({message:`AssociateMember Created successfully`,AssociateMemberCreated})
        }catch(err){
            console.log(err)
            if(err.code == 11000){
                return res.status(500).json({message: `AssociateMember with this information is already exist please try with another name or Mobile Number` })
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
        return res.status(400).json({message: `team Admin UID is not valid`})
        }
        const savedAdmin = await TeamAdmin.findOne({_id:teamObj.AdminID});
        if(!savedAdmin){
        return res.status(400).json({message: `team Admin  is not valid`})
        }
        const savedTeam = await Team.findOne({teamName:req.body.teamName});
        if(savedTeam){
        return res.status(400).json({message: `teamName already exist with please try with different teamName`})
        }
        const TeamACreated = await Team.create(teamObj)
        res.status(201).json({message: `Team  created Successfully `,TeamACreated})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Team with this Team Name is already exist please try with different  Team Name` })
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
            return res.status(400).json({message: `User with this email or phone number is already exist please try with different  email or phone number `})
            }
            const UserCreated = await subMatterEx.create(dataObj)
            let mailOptions = {
                from: 'serviceacount.premieleague@gmail.com',
                to: UserCreated.email,
                subject:'welcome ' ,
                text:`Dear, ${UserCreated.Name} subAdmin register you as a subject Matter Expert`
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
        return res.status(400).json({message: `team Admin UID is not valid`})
        }
        const savedAdmin = await TeamAdmin.findOne({UID:req.body.teamAdminUID});
        if(!savedAdmin){
        return res.status(400).json({message: `team Admin  is not valid`})
        }
        const savedTeam = await Team.findOne({_id:req.body.teamID});
        if(!savedTeam){
        return res.status(400).json({message: `team does not exist with this teamName`})
        }
        const playerCreated = await Player.create(playerObj)
        let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: playerCreated.email,
            subject:'welcome ' ,
            text:`Dear, ${playerCreated.Name} subAdmin register you as a Player`
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        return res.status(201).json({message: `Player created Successfully`,playerCreated})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Player with this email or phone number is already exist please try with different  email or phone number ` })
        }
        console.log("Something went wrong while saving to DB", err);
        res.status(500).json({message:err.message,status:"ERROR"})
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
            return res.status(201).json({message: `Notification send to user successfully `,msg})
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
                message: 'SubAdmin with email Already Exists'
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
                    text:`You'r successfully register as sub Admin`
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
                return res.status(201).json({message: 'Admin Created Successfully!', status: '201', userId: result._id});
            })
        
    .catch(error =>{
        if(error.code == 11000){
            return res.status(500).json({message: `user with this information is already exist please try with another email or Mobile Number` })
        }
        console.log(error)
        return res.status(400).json({message: error.message, status:'error'});
        })
    }

    async function UpdateSubAdminBySubAdmin(req,res){
        try{
            const ID = req.params.subAdminId;
            // console.log(req.body)
            const savedSubAdmin = await subAdmin.findOne({_id:ID});
            if (!savedSubAdmin){
                return res.status(400).json({message: "User Not found"});
            }
            console.log(req.body);
            savedSubAdmin.email=req.body.email ? req.body.email : savedSubAdmin.email;  
            savedSubAdmin.Phone=req.body.Phone ? req.body.Phone : savedSubAdmin.Phone;
            // console.log(req.body);
            /*Sub Admin Access*/
            savedSubAdmin.canCreateSubAdmin=req.body.canCreateSubAdmin   ? req.body.canCreateSubAdmin : savedSubAdmin.canCreateSubAdmin;
            savedSubAdmin.canUpdateSubAdmin=req.body.canUpdateSubAdmin   ? req.body.canUpdateSubAdmin : savedSubAdmin.canUpdateSubAdmin;
            savedSubAdmin.canNotifySubAdmin=req.body.canNotifySubAdmin   ? req.body.canNotifySubAdmin : savedSubAdmin.canNotifySubAdmin;
            savedSubAdmin.canGetSubAdmin=req.body.canGetSubAdmin         ? req.body.canGetSubAdmin : savedSubAdmin.canGetSubAdmin;
            savedSubAdmin.canDeleteSubAdmin=req.body.canDeleteSubAdmin   ? req.body.canDeleteSubAdmin : savedSubAdmin.canDeleteSubAdmin;
            savedSubAdmin.canBlockSubAdmin=req.body.canBlockSubAdmin     ? req.body.canBlockSubAdmin : savedSubAdmin.canBlockSubAdmin;
            
            /*Team Admin Access*/
            savedSubAdmin.canCreateTeamAdmin=req.body.canCreateTeamAdmin   ? req.body.canCreateTeamAdmin : savedSubAdmin.canCreateTeamAdmin;
            savedSubAdmin.canUpdateTeamAdmin=req.body.canUpdateTeamAdmin   ? req.body.canUpdateTeamAdmin : savedSubAdmin.canUpdateTeamAdmin;
            // savedSubAdmin.canNotifyTeamAdmin=req.body.canNotifyTeamAdmin   ? req.body.canNotifyTeamAdmin : savedSubAdmin.canNotifyTeamAdmin;
            savedSubAdmin.canNotifyTeamAdmin = req.body.canNotifyTeamAdmin != undefined
            ? req.body.canNotifyTeamAdmin
            : savedSubAdmin.canNotifyTeamAdmin
            savedSubAdmin.canGetTeamAdmin=req.body.canGetTeamAdmin         ? req.body.canGetTeamAdmin : savedSubAdmin.canGetTeamAdmin;
            savedSubAdmin.canDeleteTeamAdmin=req.body.canDeleteTeamAdmin   ? req.body.canDeleteTeamAdmin : savedSubAdmin.canDeleteTeamAdmin;
            savedSubAdmin.canBlockTeamAdmin=req.body.canBlockTeamAdmin     ? req.body.canBlockTeamAdmin : savedSubAdmin.canBlockTeamAdmin;
    
            /*Team  Access*/
            savedSubAdmin.canCreateTeam=req.body.canCreateTeam    ? req.body.canCreateTeam : savedSubAdmin.canCreateTeam;
            savedSubAdmin.canUpdateTeam=req.body.canUpdateTeam    ? req.body.canUpdateTeam : savedSubAdmin.canUpdateTeam;  
            savedSubAdmin.canNotifyTeam=req.body.canNotifyTeam    ? req.body.canNotifyTeam : savedSubAdmin.canNotifyTeam;
            savedSubAdmin.canGetTeam=req.body.canGetTeam          ? req.body.canGetTeam : savedSubAdmin.canGetTeam;
            savedSubAdmin.canDeleteTeam=req.body.canDeleteTeam    ? req.body.canDeleteTeam : savedSubAdmin.canDeleteTeam;
            savedSubAdmin.canBlockTeam=req.body.canBlockTeam      ? req.body.canBlockTeam : savedSubAdmin.canBlockTeam;
    
            /*Player Access*/
            savedSubAdmin.canCreatePlayer=req.body.canCreatePlayer  ? req.body.canCreatePlayer : savedSubAdmin.canCreatePlayer; 
            savedSubAdmin.canUpdatePlayer=req.body.canUpdatePlayer  ? req.body.canUpdatePlayer : savedSubAdmin.canUpdatePlayer;
            savedSubAdmin.canNotifyPlayer=req.body.canNotifyPlayer  ? req.body.canNotifyPlayer : savedSubAdmin.canNotifyPlayer;
            savedSubAdmin.canGetPlayer=req.body.canGetPlayer        ? req.body.canGetPlayer : savedSubAdmin.canGetPlayer;
            savedSubAdmin.canDeletePlayer=req.body.canDeletePlayer  ? req.body.canDeletePlayer : savedSubAdmin.canDeletePlayer;
            savedSubAdmin.canBlockPlayer=req.body.canBlockPlayer    ? req.body.canBlockPlayer : savedSubAdmin.canBlockPlayer;  
            /*SubMatterEx Access*/
            savedSubAdmin.canCreateSubMatterEx=req.body.canCreateSubMatterEx   ? req.body.canCreateSubMatterEx : savedSubAdmin.canCreateSubMatterEx;
            savedSubAdmin.canUpdateSubMatterEx=req.body.canUpdateSubMatterEx   ? req.body.canUpdateSubMatterEx : savedSubAdmin.canUpdateSubMatterEx;
            savedSubAdmin.canNotifySubMatterEx=req.body.canNotifySubMatterEx   ? req.body.canNotifySubMatterEx : savedSubAdmin.canNotifySubMatterEx;
            savedSubAdmin.canGetSubMatterEx=req.body.canGetSubMatterEx         ? req.body.canGetSubMatterEx : savedSubAdmin.canGetSubMatterEx;
            savedSubAdmin.canDeleteSubMatterEx=req.body.canDeleteSubMatterEx   ? req.body.canDeleteSubMatterEx : savedSubAdmin.canDeleteSubMatterEx;
            savedSubAdmin.canBlockSubMatterEx=req.body.canBlockSubMatterEx     ? req.body.canBlockSubMatterEx : savedSubAdmin.canBlockSubMatterEx;
    
            /*AssociateMember Access*/
            savedSubAdmin.canCreateAssociateMember =req.body.canCreateAssociateMember  ? req.body.canCreateAssociateMember : savedSubAdmin.canCreateAssociateMember; 
            savedSubAdmin.canUpdateAssociateMember =req.body.canUpdateAssociateMember  ? req.body.canUpdateAssociateMember : savedSubAdmin.canUpdateAssociateMember;
            savedSubAdmin.canNotifyAssociateMember =req.body.canNotifyAssociateMember  ? req.body.canNotifyAssociateMember : savedSubAdmin.canNotifyAssociateMember;  
            savedSubAdmin.canGetAssociateMember =req.body.canGetAssociateMember        ? req.body.canGetAssociateMember : savedSubAdmin.canGetAssociateMember;
            savedSubAdmin.canDeleteAssociateMember =req.body.canDeleteAssociateMember  ? req.body.canDeleteAssociateMember : savedSubAdmin.canDeleteAssociateMember;
            savedSubAdmin.canBlockAssociateMember =req.body.canBlockAssociateMember    ? req.body.canBlockAssociateMember : savedSubAdmin.canBlockAssociateMember;
            
            const updateSubAdmin = await savedSubAdmin.save()
    
            return res.status(200).json({ updateSubAdmin,message: "SubAdmin  Updated Successfully"})
        }catch(err){
            if(err.code == 11000){
                return res.status(400).json({message: `User with this email or phone number  is already exist please try with different  email or phone number ` })
            }
            console.log(err)
            res.status(500).json({message: err.message,status:`ERROR`});
        }
    }
module.exports = {
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