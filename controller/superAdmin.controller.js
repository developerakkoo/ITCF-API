const superAdmin =  require('../models/superAdmin.model');
const subAdmin = require('../models/subAdmin.model');
const TeamAdmin = require('../models/TeamAdmin.model');
const Notification = require('../models/Notification.model');
const Team =  require('../models/Team.model');
const Player =  require('../models/player.mode');
const associateMember =require('../models/associateMember.model');
const subMatterEx =  require('../models/subMatterEx.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const APIFeatures = require('../utils/ApiFeature');
require('dotenv').config();
const mongoosePaginate = require('mongoose-paginate');

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
    const supperAdmin = await superAdmin.findOne({ email: email})
        if(supperAdmin){
            res.status(400).json({
            status: false,
            message: 'Supper Admin With This Email Is Already Exists'
        })
        }
        bcrypt.hash(password, 12)
        .then(async (hashedPasswords) => {
            const admin = new superAdmin({
                email: email,
                password: hashedPasswords,
                Phone:Phone
            });

            const createdAdmin = await admin.save();
            let mailOptions = {
                from: 'serviceacount.premieleague@gmail.com',
                to: createdAdmin.email,
                subject:'welcome ' ,
                text:`You'r successfully register as supper Admin`
            };
            msg.sendMail(mailOptions, function(error, info){
                if (error) {
                console.log(error);
                } else {
                console.log('Email sent: ' + info.response);
                }
            });
            return createdAdmin ;
        }).then((result) => {
            return res.status(201).json({message: 'Supper Admin Created Successfully!', status: '201', userId: result._id});
        })
    
.catch(error =>{
    if(error.code == 11000){
        return res.status(500).json({message: `Supper Admin With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number` })
    }
    res.status(400).json({message: error.message, status:'error'});
    })
}

const postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    const supperAdmin = await superAdmin.findOne({ email: email})
        if(!supperAdmin){
            const error = new Error('Supper Admin Not Found');
            error.status = 404;
            next(error);
        }
        loadedUser = supperAdmin;
        bcrypt.compare(password, supperAdmin.password)
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

async function UpdateSuperAdmin(req,res){
    try{
        const ID = req.params.Id;
        // console.log(req.body)
        const savedSuperAdmin = await superAdmin.findOne({_id:ID});
        if (!savedSuperAdmin){
            return res.status(400).json({message: "Supper Admin Not Found"});
        }
        savedSuperAdmin.email=req.body.email ? req.body.email : savedSuperAdmin.email;  
        savedSuperAdmin.Phone=req.body.Phone ? req.body.Phone : savedSuperAdmin.Phone;

        const updateSuperAdmin = await savedSuperAdmin.save()

        return res.status(200).json({ updateSuperAdmin,message: "Super Admin  Updated Successfully"})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Supper Admin With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number ` })
        }
        console.log(err)
        res.status(500).json({message: err.message,status:`ERROR`});
    }
}

async function DeleteSuperAdmin(req,res){
    try{
        const savedSuperAdmin= await superAdmin.findOne({_id:req.params.Id})
        if (!savedSuperAdmin){
            return res.status(400).json({message: "SuperAdmin Not found"});
        }
        await superAdmin.deleteOne({_id:req.params.Id})
        res.status(200).json({ message: `SuperAdmin  Deleted Successfully with ID: ${req.params.Id}`})
    }catch(err){
        res.status(500).json({message: err.message,status:"ERROR" });
    }
}

async function  signUpTeamAdmin(req,res){
    const ID =req.params.Id;
try{
    
        const AdminUserObj ={
            superAdminID:ID,
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
    return res.status(400).json({message: `team Admin Already Exist With  This Email Adders!${req.body.email}`})
    }
    const TeamAdminCreated = await TeamAdmin.create(AdminUserObj)
    const postResponse={
        superAdminID:TeamAdminCreated.superAdminID,
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
        text:`Dear ${TeamAdminCreated.fName}, superAdmin register you as a team admin, for login use this UID: ${id}`
    };
    msg.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
    res.status(201).json({message: `Team Admin Created Successfully UID Is Send To Your Register Email!`,postResponse})
}catch(err){
    if(err.code == 11000){
        return res.status(400).json({message: `Team Admin With This Email Or Phone Number  Is Already Exist Please Try With Different  Email Or Phone Number ` })
    }
    console.log("Something went wrong while saving to DB", err);
    res.status(500).json({message:err.message,status:`ERROR`})
}
}

async function signUpAssociateMember(req,res){
    // console.log("AddDetails")
    // console.log("data>>",req.files.PANCard[0].path)
    const ID =req.params.Id;
    const userObj = {
        superAdminID:ID,
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
            text:`Dear ${AssociateMemberCreated.fName}, superAdmin register you as a AssociateMember`
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).json({message:`Associate Member Created successfully`,AssociateMemberCreated})
    }catch(err){
        console.log(err)
        if(err.code == 11000){
            return res.status(500).json({message: `Associate Member With This Information Is Already Exist Please Try With Another Name Or Mobile Number` })
        }
        res.status(500).json({message:err.message,status:`ERROR`});
    }
    
}

async function  signUpTeam(req,res){
    // console.log(">>>>>>",req.body)
const teamObj ={
    superAdminID:req.params.Id,
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
    if(!savedTeam){
    return res.status(400).json({message: `Team Name Already Exist  Please Try With Different Team Name`})
    }
    const TeamACreated = await Team.create(teamObj)
    res.status(201).json({message: `Team  Created Successfully `,TeamACreated})
}catch(err){
    if(err.code == 11000){
        return res.status(400).json({message: `Team With This Team Name Is Already Exist Please Try With Different  Team Name` })
    }
    console.log("Something went wrong while saving to DB", err);
    res.status(500).json({message:err.message,status:"ERROR"})
}
}

async function signUpMatterEx(req,res){
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
        superAdminID:req.params.Id,
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
        return res.status(400).json({message: `subject Matter Expert With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number `})
        }
        const UserCreated = await subMatterEx.create(dataObj)
        let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: UserCreated.email,
            subject:'welcome ' ,
            text:`Dear, ${UserCreated.Name} superAdmin register you as a subject Matter Expert`
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        return res.status(201).json({message: `User Created Successfully`,UserCreated})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `subject Matter Expert With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number` })
        }
        console.log("Something went wrong while saving to DB", err);
        res.status(500).json({message:err.message,status:"ERROR"})
    }
} 

async function  singUpPlayer(req,res){
    // console.log(">>>>>>",req.body)
const playerObj ={
    superAdminID:req.params.Id,
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
        text:`Dear, ${playerCreated.Name} super Admin register you as a Player`
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
        return res.status(400).json({message: `Player With This Email Or Phone Number Is Already Exist Please Try With Different  Email Or Phone Number ` })
    }
    console.log("Something went wrong while saving to DB", err);
    res.status(500).json({message:err.message,status:"ERROR"})
}
}

async function sendNotification(req,res){
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


async function NotificationSearchOption (req, res, next) {

    try {
        const query = req.query.query;
        const term = req.query.term;
        console.log(query + term);
        const features = await new APIFeatures(Notification.find(), req.query)
        .filter()
        .sort()

        const notifications = await features.query;

        res.status(200).json({
        status: "success",
        statusCode: 200,
        results: notifications.length,
        searchData: notifications,
        });
    } catch (err) {
        console.log(err)
    res.status(404).json({message: err.message, status:`ERROR`});
    }
};


async function updateNotification(req,res){
    try{
        const savedNotification = await Notification.findOne({_id:req.params.notificationId});
        if(!savedNotification){
            return res.status(404).json({message: "Message Not Found"});
        }
        savedNotification.message=req.body.message ? req.body.message : savedNotification.message;
        const updateNotification= await savedNotification.save();
        return res.status(202).json({ message: "Message  Updated Successfully",updateNotification})
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function deleteNotification(req,res){
    try{
        const savedNotification = await Notification.findOne({_id:req.params.notificationId});
        if(!savedNotification){
            return res.status(404).json({message: "Message Not found"});
        }
        
        await savedNotification.deleteOne({_id:req.params.notificationId});
        return res.status(202).json({ message: `Notification  deleted Successfully with Notification ID: ${req.params.notificationId}`})
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function singUpSubAdmin (req, res, next){
    const superAdminID = req.params.Id
    const email = req.body.email;
    const Phone = req.body.Phone;
    const password = req.body.password;
    const SubAdmin = await subAdmin.findOne({ email: email})
        if(SubAdmin){
            return res.status(400).json({
            status: false,
            message: 'SubAdmin With Email Already Exists'
        })
        }
        bcrypt.hash(password, 12)
        .then(async (hashedPasswords) => {
            const admin = new subAdmin({
                superAdminID:superAdminID,
                email: email,
                password: hashedPasswords,
                Phone:Phone
            });

            const createdSubAdmin = await admin.save();
            let mailOptions = {
                from: 'serviceacount.premieleague@gmail.com',
                to: createdSubAdmin.email,
                subject:'welcome ' ,
                text:`SuperAdmin register you as a sub Admin`
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
            return res.status(201).json({message: 'SubAdmin Created Successfully!', status: '201', userId: result._id});
        })
    
.catch(error =>{
    if(error.code == 11000){
        return res.status(500).json({message: `User With This Information Is Already Exist Please Try With Another Email Or Mobile Number` })
    }
    console.log(error)
    return res.status(400).json({message: error.message, status:'ERROR'});
    })
}

async function UpdateSubAdminBySuperAdmin(req,res){
    try{
        const ID = req.params.subAdminId;
        // console.log(req.body)
        const savedSubAdmin = await subAdmin.findOne({_id:ID});
        if (!savedSubAdmin){
            return res.status(400).json({message: "Sub Admin Not Found"});
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

module.exports= {
    postSignup,
    postLogin,
    UpdateSuperAdmin,
    DeleteSuperAdmin,
    signUpTeamAdmin,
    signUpAssociateMember,
    signUpTeam,
    signUpMatterEx,
    singUpPlayer,
    sendNotification,
    NotificationSearchOption,
    updateNotification,
    deleteNotification,
    singUpSubAdmin,
    UpdateSubAdminBySuperAdmin
}