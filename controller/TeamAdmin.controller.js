const TeamAdmin = require('../models/TeamAdmin.model');
const Player =  require('../models/player.mode');
const Team = require('../models/Team.model');
const Notification = require('../models/Notification.model');
const APIFeatures = require('../utils/ApiFeature')
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

let msg = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
    }
}); 

async function  signUp(req,res){
try{
const AdminUserObj ={
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
    return res.status(400).json({message: `User Already Exist With This ${req.body.email} Email Adders Please Try With Different Email Address `})
    }
    const TeamAdminCreated = await TeamAdmin.create(AdminUserObj)
    const postResponse={
        ID:TeamAdminCreated._id,
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
        text:`User ID  is ${id}`
    };
    msg.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log(error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });
    res.status(201).json({message: `Team Admin Created Successfully UIDIs Send To Register Email!`,postResponse})
}catch(err){
    if(err.code == 11000){
        return res.status(400).json({message: `Team Admin With This Email Or Phone Number  Is Already Exist Please Try With Different  Email Or Phone Number ` })
    }
    console.log("Something went wrong while saving to DB", err);
    res.status(500).json({message:err.message,status:`ERROR`});
}
}

async function signIn(req, res){
    try{
    const user = await TeamAdmin.findOne({ UID: req.body.id });
    // console.log("SignIn Request for ", user);
    if (!user) {
        return res.status(400).json({message: "Failed! UserId Doesn't Exist, Your UID Is Send To Your Registered Email Address  ",access: false});
    }
    res.status(200).json({ID:user._id,UID:user.UID,PhoneNo:user.Phone})
}catch(err){
    // console.log(err);
    res.status(500).json({message: err.message,status:"ERROR"})
    }
}

async function UpdateTeamAdmin(req,res){
    try{
        const ID = req.params.teamAdID;
        console.log(req.body)
        const savedTeamAdmin = await TeamAdmin.findOne({_id:ID});
        if (!savedTeamAdmin){
            return res.status(400).json({message: "Team Admin Not Found"});
        }
        
        savedTeamAdmin.fName=req.body.fName ? req.body.fName : savedTeamAdmin.fName;
        savedTeamAdmin.lName=req.body.lName ? req.body.lName : savedTeamAdmin.lName;
        savedTeamAdmin.age=req.body.age ? req.body.age : savedTeamAdmin.age;
        savedTeamAdmin.DOB=req.body.DOB ? req.body.DOB : savedTeamAdmin.DOB;
        savedTeamAdmin.email=req.body.email ? req.body.email : savedTeamAdmin.email;  
        savedTeamAdmin.Phone=req.body.Phone ? req.body.Phone : savedTeamAdmin.Phone;
        savedTeamAdmin.Skills=req.body.Skills ? req.body.Skills : savedTeamAdmin.Skills;
        savedTeamAdmin.isBlocked = req.body.isBlocked != undefined
        ? req.body.isBlocked
        : savedTeamAdmin.isBlocked

        // console.log(savedTeamAdmin.fName)
        const updateUser = await savedTeamAdmin.save()

        return res.status(200).json({ updateUser,message: "Team Admin  Updated Successfully"})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Team Admin With This Email Or Phone Number  Is Already Exist Please Try With Different  Email Or Phone Number ` })
        }
        console.log(err)
        res.status(500).json({message: err.message,status:`ERROR`});
    }
}

async function getAllTeamAdmin(req,res){
    try{
    const pageNumber = req.query.page || 1;// Get the current page number from the query parameters
    const skipValue = req.query.skip || 0; 
    const pageSize = 10; // Number of items per page

    TeamAdmin.paginate({}, { page: pageNumber, limit: pageSize ,skip:skipValue}, (err, result) => {
if (err) {
    return res.status(500).json({ message: 'Error occurred while fetching Data.' });
}

const { docs, total, limit, page, pages } = result;
res.json({ userTeamAdmins: docs, total, limit, page, pages });
});
    }catch(err){
        res.status(500).json({message: `Internal sever error while inserting the element ${err.message} `});
    }
}

async function getTeamAdminById(req,res){
    try{
        const savedTeamAdmin= await TeamAdmin.findOne({_id:req.params.Id})
        if (!savedTeamAdmin){
            return res.status(400).json({message: "Team Admin Not Found"});
        }
        res.status(200).json({ savedTeamAdmin,message: "Team Admin  Fetched Successfully"})
    }catch(err){
        res.status(500).json({message: err.message,status:`ERROR`});
    }
}

async function getTeamAdminByUid(req,res){
    try{
        const savedTeamAdmin= await TeamAdmin.findOne({UID:req.params.Id})
        if (!savedTeamAdmin){
            return res.status(400).json({message: "Team Admin Not Found"});
        }
        res.status(200).json({ savedTeamAdmin,message: "Team Admin  Fetched Successfully"})
    }catch(err){
        res.status(500).json({message: err.message,status:`ERROR`});
    }
}

async function DeleteTeamAdmin(req,res){
    try{
        const savedTeamAdmin= await TeamAdmin.findOne({_id:req.params.teamAdID})
        if (!savedTeamAdmin){
            return res.status(400).json({message: "Team Admin Not Found"});
        }
        const deletedTeamAdmin = await TeamAdmin.deleteOne({_id:req.params.teamAdID})
        res.status(200).json({ message: `Team Admin  Deleted Successfully With ID: ${req.params.Id}`})
    }catch(err){
        res.status(500).json({message: err.message,status:"ERROR" });
    }
}

async function teamAdminSearchOption (req, res, next) {

    try {
        const query = req.query.query;
        const term = req.query.term;
        console.log(query + term);
        const features = await new APIFeatures(TeamAdmin.find().lean().populate('superAdminID','email'), req.query)
        .filter()
        .sort()

        const teamAdmins = await features.query;

        res.status(200).json({
        status: "success",
        statusCode: 200,
        results: teamAdmins.length,
        searchData: teamAdmins,
        });
    } catch (err) {
        console.log(err)
    res.status(404).json({message: err.message, status:`ERROR`});
    }
};

async function totalTeamAdmin(req,res){
    const pipeline =[
        [
            {
            '$count': 'totalTeamAdmin'
            }
        ]
    ]
    try{
        const totalTeamAdmin = await TeamAdmin.aggregate(pipeline);
        
        res.status(200).json({totalTeamAdmin})
    }catch(err){
        res.status(500).json({message:err.message,status:`ERROR` })
    }
}

async function totalTeamAdminReport(req,res){
    const pipeline =[
        [
            {
            '$count': 'totalTeamAdmin'
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
                        '_id': 'total Active totalTeamAdmin', 
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
                        '_id': 'total Blocked totalTeamAdmin', 
                        'value': {
                        '$count': {}
                        }
                    }
                }
        ]
    ]
    try{
        const count = await TeamAdmin.aggregate(pipeline);
        const isActive = await TeamAdmin.aggregate(pipeline1);
        const isBlocked = await TeamAdmin.aggregate(pipeline2);

        let Data = [count[0],isActive[0],isBlocked[0]]
        res.status(200).json({label:`totalTeamAdminExReport`,Data})
    }catch(err){
        res.status(500).json({message:err.message,status:`ERROR` })
    }
}

async function getAllTeamAdminNotification(req,res){
    try{
        const savedTeamAdmin = await TeamAdmin.findOne({_id:req.params.userID});
        if (!savedTeamAdmin){
            return res.status(404).json({message: "Team Admin Not Found"});
        }
        const message = await Notification.find({userID:req.params.userID});
        if (!message[0]){
            return res.status(404).json({message: "Message Not Found"});
        }
        return res.status(404).json({count:message.length ,messages:message});
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function getTeamAdminNotification(req,res){
    try{
        const savedTeamAdmin = await TeamAdmin.findOne({_id:req.params.userID});
        if (!savedTeamAdmin){
            return res.status(404).json({message: "Team Admin Not Found"});
        }
        const message = await Notification.findOne({_id:req.params.msgID});
        if (!message){
            return res.status(404).json({message: "Message Not Found"});
        }
        return res.status(404).json({count:message.length ,messages:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function deleteTeamAdminNotification(req,res){
    try{
        const savedTeamAdmin = await TeamAdmin.findOne({_id:req.params.userID});
        if (!savedTeamAdmin){
            return res.status(404).json({message: "Team Admin Not Found"});
        }
        const savedNotification = await Notification.findOne({_id:req.params.msgID})
        if (!savedNotification){
            return res.status(404).json({message: "Message Not Found"});
        }
        await savedNotification.deleteOne({_id:req.params.msgID});
        return res.status(202).json({ message: `Notification  Deleted Successfully With Notification ID: ${req.params.msgID}`})
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function PlayerBulkCreate(req,res){
    try {
        const savedTeamAdmin = await TeamAdmin.findOne({_id:req.params.Id});
        if (!savedTeamAdmin) {
            return res.status(404).json({message:`Team Admin Not Found With Id:${req.params.Id}`});
        }
        const createPlayers = [];
        const players =  req.body.Players;
        players.forEach(player => {
            createPlayers.push(player)
            
            });
            console.log('createPlayers');
            const playerCreated =  await Player.insertMany(createPlayers)
            res.status(201).json({message:'Players Inserted',Count:playerCreated.length,playerCreated});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message,Status:`ERROR`});
    }
}

async function addPlayerToTeam(req,res){
    try {
        const savedTeamAdmin = await TeamAdmin.findOne({_id:req.params.TeamAdminId});
        if (!savedTeamAdmin) {
            console.log('pass TA');
            return res.status(400).json({message:`Team Admin Not Found With This ID:${req.params.TeamAdminId}`});
        }
        const savedTeam = await Team.findOne({_id:req.params.TeamId});
        if (!savedTeam) {
            console.log('pass T');
            return res.status(400).json({message:`Team Not Found With This ID:${req.params.TeamId}`});
        }

        const PlayerIds = req.body.Players
        if (req.body.insert ){
            PlayerIds.forEach(playerId => {
            savedTeam.teamMembers.push(playerId)
            
        })}
        else if (req.body.Delete){
            savedPlayerIds = savedTeam.teamMembers.filter((playerId)=>{
                return !PlayerIds.includes(playerId.toString());
            })
            savedTeam.teamMembers = savedPlayerIds;
        }
        const updateTeam= await savedTeam.save();
        return res.status(200).send(updateTeam);
    } catch (error) {
        res.status(500).json({message: error.message,Status:`ERROR`});
    }
}

//transporter contain our mail sender and password

//sending mail about rest password with rest password page link
async function forgotPassword(req,res){
    const {email}= req.body;
    const User = await TeamAdmin.findOne({ email: req.body.email });
    if(!User){
        res.send('Team Admin Not Registered');
        return;
    }
    
    const payload = {
        userId: User._id,
        email:User.email 
    }
    let token = jwt.sign(payload, process.env.SECRET_KEY + User.password, { expiresIn: 86400 });// 24 hours
    const Link = `http://localhost:8000/rest-password/${User._id}/${token}`
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
    const user = await TeamAdmin.findOne({ _id: req.params.id })
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
    const user = await TeamAdmin.findOne({ _id: req.params.id });
    if(!user){
        res.send('Invalid Id...!');
    }
    try{
        const payload = jwt.verify(token,process.env.SECRET_KEY + user.password);
        
            user.password= bcrypt.hashSync(req.body.password, 16) ? bcrypt.hashSync(req.body.password, 16) : user.password
        const updatedUser= await user.save(user);
        res.status(200).send(updatedUser);

    }catch(error){
        console.log(error.message);
        res.send(error.message);
    }
}




module.exports={
    signUp,
    signIn,
    PlayerBulkCreate,
    addPlayerToTeam,
    UpdateTeamAdmin,
    getAllTeamAdmin,
    getTeamAdminById,
    getTeamAdminByUid,
    DeleteTeamAdmin,
    teamAdminSearchOption,
    forgotPassword,
    getResetPassword,
    ResetPassword,
    totalTeamAdmin,
    totalTeamAdminReport,
    getAllTeamAdminNotification,
    getTeamAdminNotification,
    deleteTeamAdminNotification
    
}