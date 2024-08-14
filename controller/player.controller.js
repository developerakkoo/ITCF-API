const Player =  require('../models/player.mode');
const Notification = require('../models/Notification.model');
const Team =  require('../models/Team.model');
const APIFeatures = require('../utils/ApiFeature');
const TeamAdmin = require('../models/TeamAdmin.model');
const Req =  require('../models/proPlayerReq.model');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const fs = require('fs');
require('dotenv').config();
const ejs = require('ejs');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid,authToken);


let msg = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
    }
});




async function UpdatePlayer(req,res){
    try{
        const ID = req.params.playerId;
        // console.log(req.body)
        const savedPlayer = await Player.findOne({_id:ID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found",statusCode:'404'});
        }
        savedPlayer.Name = req.body.Name != undefined
        ? req.body.Name 
        : savedPlayer.Name;
        
        savedPlayer.age = req.body.age != undefined
        ? req.body.age 
        : savedPlayer.age;
        
        savedPlayer.DOB = req.body.DOB != undefined
        ? req.body.DOB 
        : savedPlayer.DOB;
        
        savedPlayer.email = req.body.email != undefined
        ? req.body.email 
        : savedPlayer.email;  
        
        savedPlayer.Phone = req.body.Phone = undefined
        ? req.body.Phone 
        : savedPlayer.Phone;

        savedPlayer.Skills = req.body.Skills != undefined
        ? req.body.Skills 
        : savedPlayer.Skills;

        savedPlayer.isBlocked = req.body.isBlocked != undefined
        ? req.body.isBlocked
        : savedPlayer.isBlocked

        savedPlayer.isFeePaid = req.body.isFeePaid != undefined
        ? req.body.isFeePaid
        : savedPlayer.isFeePaid
        
        const data= await savedPlayer.save();

        return res.status(201).json({ message: "Player  Updated Successfully",statusCode:'201',data})
    }catch(err){
        if(err.code == 11000){
            return res.status(500).json({message: `Player With This Information Is Already Exist Please Try With Another Name Or Mobile Number` ,statusCode:'500'})
        }
        console.log(err)
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}

async function requestToProPlayer(req,res){
    try{
        const ID = req.params.playerId;
        // console.log(req.body)
        const savedPlayer = await Player.findOne({_id:ID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found",statusCode:'404'});
        }
        const ceratedReq = await Req.create({playerID:savedPlayer._id})
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

        return res.status(200).json({ message: "Request To Pro Player Sent Successfully",statusCode:'200',data:ceratedReq,status:true})
    // }
    // return res.status(200).json({ message: "Player  Updated To Pro Player Successfully",statusCode:'200',data:updatePlayer})
    }catch(err){
        if(err.code == 11000){
            return res.status(500).json({message: `Player With This Information Is Already Exist Please Try With Another Name Or Mobile Number`,statusCode:'500'})
        }
        console.log(err)
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}

async function proPlayer(req,res){
    try{
        const ID = req.params.playerId;
        // console.log(req.body)
        const savedPlayer = await Player.findOne({_id:ID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found",statusCode:'404'});
        }
        savedPlayer.isProfessionalMember = req.body.isProfessionalMember != undefined
        ? req.body.isProfessionalMember
        : savedPlayer.isProfessionalMember
        await Req.deleteOne({_id:savedPlayer._id});
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

        return res.status(200).json({ message: "Player  Updated To Pro Player Successfully",statusCode:'200',data:updatePlayer,status:true})
    }
    return res.status(200).json({ message: "Player  Updated To Pro Player Successfully",statusCode:'200',data:updatePlayer})
    }catch(err){
        if(err.code == 11000){
            return res.status(500).json({message: `Player With This Information Is Already Exist Please Try With Another Name Or Mobile Number`,statusCode:'500'})
        }
        console.log(err)
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}


async function getAllPlayer(req,res){
    try{
        const savedPlayer = await Player.find();
        if (savedPlayer.length == 0) {
            return res.status(404).json({message:'Players Not Found',statusCode:404});
        }
        res.status(200).json({message:'Players Fetched SuccessFully',statusCode:200,length:savedPlayer.length,data:savedPlayer});

    }catch(err){
        res.status(500).json({message: err.message, statusCode:'500',status:`ERROR`});
    }
}

async function getPlayerById(req,res){
    try{
        const savedPlayer = await Player.findOne({_id:req.params.Id})
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found",statusCode:'404'});
        }
        res.status(200).json({ message: "Player  Fetched Successfully",statusCode:'200',data:savedPlayer})
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500', status:`ERROR`});
    }
}


async function DeletePlayer(req,res){
    try{
        const savedPlayer= await Player.findOne({_id:req.params.playerId})
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found",statusCode:'404'});
        }
        await Player.deleteOne({_id:req.params.playerId})
        res.status(200).json({ message: `Player  Deleted Successfully With ID: ${req.params.playerId}`,statusCode:'200'})
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500',status:"ERROR" });
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
    res.status(500).json({message: err.message,statusCode:'500', status:`ERROR`});
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
        
        res.status(200).json({statusCode:'200',data:player})
    }catch(err){
        res.status(500).json({message:err.message,statusCode:'500',status:`ERROR` })
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

        let data = [count[0],isActive[0],isBlocked[0]]
        res.status(200).json({statusCode:'200',label:`totalPlayerReport`,data})
    }catch(err){
        res.status(500).json({message:err.message,statusCode:'500',status:`ERROR` })
    }
}

async function getAllPlayersNotification(req,res){
    try{
        const savedPlayer = await Player.findOne({_id:req.params.userID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found",statusCode:'404'});
        }
        const message = await Notification.find({userID:req.params.userID})
        return res.status(200).json({message:'All Notification Fetched Successfully',statusCode:'200',count:message.length ,data:message});
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}

async function getPlayerNotification(req,res){
    try{
        const savedPlayer = await Player.findOne({_id:req.params.userID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found",statusCode:'404'});
        }
        const message = await Notification.findOne({_id:req.params.msgID})
        if (!message){
            return res.status(404).json({message: "Message Not Found",statusCode:'404'});
        }
        return res.status(200).json({message:'Notification Fetched Successfully',statusCode:'200',count:message.length ,data:message});
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}

async function deletePlayerNotification(req,res){
    try{
        const savedPlayer = await Player.findOne({_id:req.params.userID});
        if (!savedPlayer){
            return res.status(404).json({message: "Player Not Found",statusCode:'404'});
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
            return res.status(404).json({message:`Team Admin Not Found`,statusCode:'404'});
        }
        const savedTeam = await Team.findOne({teamName:req.params.teamName});
        if (!savedTeam) {
            return res.status(404).json({message:`Team Not Found`,statusCode:'404'});
        }
        const userObj={
            AdminID: req.params.AdminID ,
            Name: req.body.Name,
            Phone: req.body.Phone,
            email: req.body.Email,
            Password:await bcrypt.hash(req.body.Password,10),
        }
        const savedPlayer = await Player.findOne({Phone:req.body.Phone});
        if (savedPlayer){
            return res.status(400).json({message: `Player With This Information Is Already Exist Please Try With Another Name Or Mobile Number` ,statusCode:'400'});
        }
        const createdPlayer = await Player.create(userObj);
        createdPlayer. isAcceptInvite = true != undefined
        ? true
        :createdPlayer.isAcceptInvite
        const player = await createdPlayer.save()
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
        client.messages
        .create({
            body: `Successfully register as player  and Added in to The Team ${req.params.teamName} `,
            from: '+15416232876',
            to: '+91'+createdPlayer.Phone
        })
        .then(message => console.log(message.sid)).catch(error=>{
            console.log({message: error.message,statusCode:'500',Status:`ERROR`});;
        })
        res.render('submit')
        // res.status(200).json({message:'Player Created and Added to team SuccessFully',statusCode:'200',data:player,Team:updatedTeam});
    } catch (error) {
        console.log(error);
        if(err.code == 11000){
            return res.status(500).json({message: `Player With This Information Is Already Exist Please Try With Another Name Or Mobile Number` ,statusCode:'500'})
        }
        res.status(500).json({message: error.message,statusCode:'500',Status:`ERROR`});
    }

}



// log in

async function verifyNumber(req,res){
    try {
        const savedPlayer = await Player.findOne({Phone:req.query.phoneNumber});
        if (!savedPlayer) {
            return res.status(404).json({message:`Player Not Found With This Phone Number:${req.query.phoneNumber}`,statusCode:'404',status:false});
        }
        res.status(200).json({Status:true,access:true, message:"Player Found",statusCode:'200',status:true,userId:savedPlayer._id,isFeePaid:savedPlayer.isFeePaid});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}

async function  postPlayer(req,res){
    // console.log(">>>>>>",req.body)
// const playerObj ={
//     Name: req.body.Name,
//     age: req.body.age,
//     DOB: req.body.DOB,
//     email: req.body.email,
//     Phone: req.body.Phone,
//     Skills: req.body.Skills,
// }
try{
  // console.log(req.body)
    const ID = req.params.playerId;
    const savedPlayer = await Player.findOne({_id:ID});
    if (!savedPlayer){
        return res.status(404).json({message: "Player Not Found",statusCode:'404'});
    }
    savedPlayer.Name = req.body.Name = undefined
    ? req.body.Name 
    : savedPlayer.Name;
    
    savedPlayer.age = req.body.age != undefined
    ? req.body.age 
    : savedPlayer.age;
    
    savedPlayer.DOB = req.body.DOB != undefined
    ? req.body.DOB 
    : savedPlayer.DOB;
    
    savedPlayer.email = req.body.email != undefined
    ? req.body.email 
    : savedPlayer.email;  
    
    savedPlayer.Phone = req.body.Phone != undefined
    ? req.body.Phone 
    : savedPlayer.Phone;
    
    savedPlayer.Skills = req.body.Skills != undefined
    ? req.body.Skills 
    : savedPlayer.Skills;
    
    savedPlayer.isAcceptInvite = true != undefined
    ? true
    : savedPlayer.isBlocked
    
    const data= await savedPlayer.save(); 
    let mailOptions = {
        from: 'serviceacount.premieleague@gmail.com',
        to: data.email,
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
    return res.status(200).json({message: `Player Created Successfully`,statusCode:'200',data})
}catch(err){
    if(err.code == 11000){
        return res.status(500).json({message: `Player With This Information Is Already Exist Please Try With Another Name Or Mobile Number` ,statusCode:'500'})
    }
    console.log("Something went wrong while saving to DB", err);
    res.status(500).json({message:err.message,statusCode:'500',status:"ERROR"})
}
}

async function postPlayerImage(req,res){
try {

    const path = req.protocol +"://"+req.hostname +"/"+ req.file.path.replace(/\\/g, "/");
    const savedPlayer = await Player.findOne({_id:req.params.playerId});
    if(!savedPlayer){
    return res.status(404).json({message:`Player Not Found With This Player Id: ${req.params.playerId}`,statusCode:'404'});
    }
    savedPlayer.image = path != undefined
    ? path
    : savedPlayer.image

    const data = await savedPlayer.save();
    res.status(201).json({message:'Image Uploaded Successfully',data,statusCode:'201'})
} catch (error) {
    console.log(error);
    res.status(500).json({message: error.message,statusCode:'500',status:"ERROR" });
}
}

async function sendSmSToAdmin(req,res){
    try {
        const savedPlayer = await Player.findOne({Phone:req.body.phoneNumber});
        if (!savedPlayer) {
            return res.status(404).json({message:`Player Not Found With This Phone Number:${req.query.phoneNumber}`,statusCode:'404',status:false});
        }
        if (req.body.paymentStatus == true) {
            console.log(`message:Send to admin :${savedPlayer.Name}`);
            return res.status(200).json({message:`Player Completed There Registration And Payment :${req.query.phoneNumber}`,statusCode:'200',status:true});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}

//
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
        res.status(201).json({message:'Password And Email updated Successfully',statusCode:'201',updatedPlayer});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
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
    requestToProPlayer,
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
    sendSmSToAdmin,
    get
}
