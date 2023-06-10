const Player =  require('../models/player.mode');
const Notification = require('../models/Notification.model');
const Team =  require('../models/Team.model');
const APIFeatures = require('../utils/ApiFeature');
const TeamAdmin = require('../models/TeamAdmin.model');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const fs = require('fs');
require('dotenv').config();
const ejs = require('ejs');
const { log } = require('console');



let msg = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
    }
});


async function  postPlayer(req,res){
    // console.log(">>>>>>",req.body)
const playerObj ={
    Name: req.body.Name,
    age: req.body.age,
    DOB: req.body.DOB,
    email: req.body.email,
    Phone: req.body.Phone,
    Skills: req.body.Skills,
}
try{
    // const admin = await TeamAdmin.findOne({UID:req.body.teamAdminUID});
    // if(!admin){
    // return res.status(400).json({message: `Team Admin UID Is Not Valid`})
    // }
    // const savedAdmin = await TeamAdmin.findOne({UID:req.body.teamAdminUID});
    // if(!savedAdmin){
    // return res.status(400).json({message: `Team Admin  Is Not Valid`})
    // }
    // const savedTeam = await Team.findOne({_id:req.body.teamID});
    // if(!savedTeam){
    // return res.status(400).json({message: `Team Does Not Exist With This Team Name`})
    // }
    const playerCreated = await Player.create(playerObj); 
    let mailOptions = {
        from: 'serviceacount.premieleague@gmail.com',
        to: playerCreated.email,
        subject:' WELCOME TO THE ITCF FAMILY ' ,
        text:"Successfully register as player "
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
        return res.status(400).json({message: `Player With This Information Is Already Exist Please Try With Another Name Or Mobile Number` })
    }
    console.log("Something went wrong while saving to DB", err);
    res.status(500).json({message:err.message,status:"ERROR"})
}
}

async function postPlayerImage(req,res){
try {

    const path = req.protocol +"://"+req.hostname +"/"+ req.file.path.replace(/\\/g, "/");
    const savedPlayer = await Player.findOne({_id:req.params.playerId});
    if(!savedPlayer){
    return res.status(404).json({message:`Player Not Found With This Player Id: ${req.params.playerId}`});
    }
    savedPlayer.image = path != undefined
    ? path
    : savedPlayer.image

    const updatedPlayer = await savedPlayer.save();
    res.status(201).json({message:'Image Uploaded Successfully',updatedPlayer})
} catch (error) {
    console.log(error);
    res.status(500).json({message: error.message,status:"ERROR" });
}
}

async function UpdatePlayer(req,res){
    try{
        const ID = req.params.playerId;
        // console.log(req.body)
        const savedPlayer = await Player.findOne({_id:ID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found"});
        }
        savedPlayer.Name=req.body.Name ? req.body.Name : savedPlayer.Name;
        savedPlayer.age=req.body.age ? req.body.age : savedPlayer.age;
        savedPlayer.DOB=req.body.DOB ? req.body.DOB : savedPlayer.DOB;
        savedPlayer.email=req.body.email ? req.body.email : savedPlayer.email;  
        savedPlayer.Phone=req.body.Phone ? req.body.Phone : savedPlayer.Phone;
        savedPlayer.Skills=req.body.Skills ? req.body.Skills : savedPlayer.Skills;
        savedPlayer.isBlocked = req.body.isBlocked != undefined
        ? req.body.isBlocked
        : savedPlayer.isBlocked
        
        const updatePlayer= await savedPlayer.save();

        return res.status(202).json({ updatePlayer,message: "Player  Updated Successfully"})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Player With This Information Is Already Exist Please Try With Another Name Or Mobile Number` })
        }
        console.log(err)
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function proPlayer(req,res){
    try{
        const ID = req.params.playerId;
        // console.log(req.body)
        const savedPlayer = await Player.findOne({_id:ID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found"});
        }
        savedPlayer.isProfessionalMember = req.body.isProfessionalMember != undefined
        ? req.body.isProfessionalMember
        : savedPlayer.isProfessionalMember
        
        const updatePlayer= await savedPlayer.save();
        if(updatePlayer.isProfessionalMember === true){
        const template = fs.readFileSync('proMemberTemplate.ejs', 'utf-8');
        const renderedTemplate = ejs.render(template, {name: savedPlayer.Name});
        let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: savedPlayer.email,
            subject:' WELCOME TO THE ITCF FAMILY ' ,
            html: renderedTemplate
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response); 
            }
        });

        return res.status(202).json({ updatePlayer,message: "Player  Updated To Pro Player Successfully"})
    }
    return res.status(202).json({ updatePlayer,message: "Player  Updated Successfully"})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Player With This Information Is Already Exist Please Try With Another Name Or Mobile Number` })
        }
        console.log(err)
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}


async function getAllPlayer(req,res){
    try{
        const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
        const pageSize = 10; // Number of items per page
        
        Player.paginate({}, { page: pageNumber, limit: pageSize }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error Occurred While Fetching Data.' });
        }
        
        const { docs, total, limit, page, pages } = result;
        res.json({ players: docs, total, limit, page, pages });
        });
    }catch(err){
        res.status(500).json({message: err.message, status:`ERROR`});
    }
}

async function getPlayerById(req,res){
    try{
        const savedPlayer = await Player.findOne({_id:req.params.Id})
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found"});
        }
        res.status(200).json({ savedPlayer,message: "Player  Fetched Successfully"})
    }catch(err){
        res.status(500).json({message: err.message, status:`ERROR`});
    }
}


async function DeletePlayer(req,res){
    try{
        const savedPlayer= await Player.findOne({_id:req.params.playerId})
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found"});
        }
        await Player.deleteOne({_id:req.params.playerId})
        res.status(200).json({ message: `Player  Deleted Successfully With ID: ${req.params.playerId}`})
    }catch(err){
        res.status(500).json({message: err.message,status:"ERROR" });
    }
}


async function PlayerSearchOption (req, res, next) {

    try {
        const query = req.query.query;
        const term = req.query.term;
        console.log(query + term);
        const features = await new APIFeatures(Player.find().populate('teamID')  .populate('AdminID') .lean().populate('superAdminID','email'), req.query)
        .filter()
        .sort()

        const players = await features.query;

        res.status(200).json({
        status: "success",
        statusCode: 200,
        results: players.length,
        searchData: players,
        });
    } catch (err) {
        console.log(err)
    res.status(404).json({message: err.message, status:`ERROR`});
    }
};

async function totalPlayer(req,res){
    const pipeline =[
        [
            {
            '$count': 'totalPlayer'
            }
        ]
    ]
    try{
        const player = await Player.aggregate(pipeline);
        
        res.status(200).json({player})
    }catch(err){
        res.status(500).json({message:err.message,status:`ERROR` })
    }
}

async function totalPlayerReport(req,res){
    const pipeline =[
        [
            {
            '$count': 'totalPlayer'
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
                        '_id': 'total Active player', 
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
                        '_id': 'total Blocked player', 
                        'value': {
                        '$count': {}
                        }
                    }
                }
        ]
    ]
    try{
        const count = await Player.aggregate(pipeline);
        const isActive = await Player.aggregate(pipeline1);
        const isBlocked = await Player.aggregate(pipeline2);

        let Data = [count[0],isActive[0],isBlocked[0]]
        res.status(200).json({label:`totalPlayerReport`,Data})
    }catch(err){
        res.status(500).json({message:err.message,status:`ERROR` })
    }
}

async function getAllPlayersNotification(req,res){
    try{
        const savedPlayer = await Player.findOne({_id:req.params.userID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found"});
        }
        const message = await Notification.find({userID:req.params.userID})
        return res.status(404).json({count:message.length ,messages:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function getPlayerNotification(req,res){
    try{
        const savedPlayer = await Player.findOne({_id:req.params.userID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found"});
        }
        const message = await Notification.findOne({_id:req.params.msgID})
        if (!message){
            return res.status(404).json({message: "Message Not Found"});
        }
        return res.status(404).json({count:message.length ,messages:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function deletePlayerNotification(req,res){
    try{
        const savedPlayer = await Player.findOne({_id:req.params.userID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found"});
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

async  function get(req,res){
    const sub =  await Team.updateMany({canUpdateSubAdmin:true})
    res.status(200).json("ok")
}

async function handelGet (req,res){
    res.render('invitationForm');
}
async function handelPost (req,res){
    try {
        console.log(req.body);
        console.log('post');
        const savedTeamAdmin = await TeamAdmin.findOne({_id:req.params.AdminID});
        if (!savedTeamAdmin) {
            return res.status(400).json({message:`Team Admin Not Found`});
        }
        const savedTeam = await Team.findOne({teamName:req.params.teamName});
        if (!savedTeam) {
            return res.status(400).json({message:`Team Not Found`});
        }
        const userObj={
            AdminID: req.params.AdminID ,
            Name: req.body.Name,
            Phone: req.body.Phone,
            email: req.body.Email,
            Password:await bcrypt.hash(req.body.Password,10)
        }
        const createdPlayer = await Player.create(userObj);
        savedTeam.teamMembers.push(createdPlayer._id);
        const updatedTeam = await savedTeam.save();
        let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: createdPlayer.email,
            subject:' WELCOME TO THE ITCF FAMILY ' ,
            text:`Successfully register as player  and Added in to The Team ${req.params.teamName} `
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
        res.status(201).json({message:'Player Created and Added to team SuccessFully',Player:createdPlayer,Team:updatedTeam});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message,Status:`ERROR`});
    }

}

async function verifyNumber(req,res){
    try {
        const savedPlayer = await Player.findOne({Phone:req.query.phoneNumber});
        if (!savedPlayer) {
            return res.status(404).json({message:`Player Not Found With This Phone Number:${req.query.phoneNumber}`});
        }
        res.status(200).json({Status:true,access:true, message:"Player Found",savedPlayer});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function setPassword(req,res){
    try {
        
        const savedPlayer = await Player.findOne({_id:req.body.Id});
        const password = await bcrypt.hash(req.body.Password,10);
        savedPlayer.email =req.body.email != undefined
        ? req.body.email
        : savedPlayer.email

        savedPlayer.Password =password != undefined
        ? password
        : savedPlayer.Password
        
        const updatedPlayer =  await savedPlayer.save();
        res.status(201).json({message:'Password And Email updated Successfully',updatedPlayer});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

module.exports={
    postPlayer,
    postPlayerImage,
    verifyNumber,
    setPassword,
    handelGet,
    handelPost,
    UpdatePlayer,
    proPlayer,
    getAllPlayer,
    getPlayerById,
    DeletePlayer,
    PlayerSearchOption,
    totalPlayer,
    totalPlayerReport,
    getAllPlayersNotification,
    deletePlayerNotification,
    getPlayerNotification,
    get
}
