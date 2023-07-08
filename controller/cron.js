const moment = require('moment');
const Team =  require('../models/Team.model');
const Player = require('../models/player.mode');
const TeamAdmin = require('../models/TeamAdmin.model')
const cron = require('node-cron');
require('dotenv').config();
const accountSid = 'AC3d2a984af8fb85d9e453ebb54477de6c';
const authToken = process.env.auth_Token;
const client = require('twilio')(accountSid, authToken);
// const nodemailer = require('nodemailer');
// let msg = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASS_KEY
//     }
// }); 


cron.schedule('* * * * *',async () =>{               // every day at 12// 0 12 * * *
    try{
            console.log('>>');
            const date = moment().format('DD-MM-YYYY');
        const savedPlayer = await Player.find({
            isAcceptInvite: false,
            notify:false,
            notifyDate:date
        })
        
        if (savedPlayer.length == 0){
            console.log("Players Not Found");
        }
        savedPlayer.forEach(async(player) => {
            console.log(player.AdminID.toString())
            const savedAdmin = await TeamAdmin.findById(player.AdminID.toString())
            console.log(savedAdmin)
                    if (!savedAdmin){
            console.log("Admin Not Found");
        } 
        client.messages
        .create({
            body: `${player.Name}, Not Competed there registration process `,
            from: '+15416232876',
            to: '+91'+savedAdmin.Phone
        })
        .then(message => console.log(message.sid))
        // let mailOptions = {
            // from: 'serviceacount.premieleague@gmail.com',
            // to: savedAdmin[0].email,
            // subject:'Update ' ,
            // text:`${player.Name}, Not Competed there registration process `
        // };
        // msg.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //     console.log(error);
        //     } else {
        //     console.log('Email sent: ' + info.response);
        //     }
        // });
            await Player.findByIdAndUpdate(player._id,{
                notify:true
            })
        });
        
        console.log(`Count of unsent notification: ${savedPlayer.length}`)
        // console.log(`unsent notification: ${savedPlayer}`)
    }catch(error){
        console.log(error);
    }
})
let Date = moment().format('DD-MM-YYYY')
cron.schedule('* * * * *',async () =>{   // every day at 12
    try{
        console.log('here>>');
        const savedPlayer = await Player.find({
            isAcceptInvite: false,
            notify:true,
            deleteDate: Date
        })
        
        if (savedPlayer.length == 0){
            console.log("Players Not Found");
        }
        console.log(`Count of undeleted Player: ${savedPlayer.length}`)
        for(player of savedPlayer){
            console.log('id',player._id.toString());
            const savedTeam = await Team.find({teamMembers: player._id})
            console.log('type:',typeof(savedTeam));
            let a = savedTeam;
            console.log(a);
            a.forEach(el =>{
                console.log(el['teamMembers']);
            })

                // console.log('array:',savedTeam['teamMembers']);
                // savedTeam['teamMembers'].forEach(e =>{
                //     console.log(e);
                // })
                // console.log("t",team.teamMembers);
                // if (!savedPlayer) {
                //     continue;
                // }
                // let itemToBeRemoved = player._id.toString() 
                // console.log('rmi',itemToBeRemoved);
                //             // // console.log(itemToBeRemoved);
                
                // // // console.log("t",team.teamMembers);
                // // if (!savedPlayer) {
                // //     continue;
                // // }
                // let savedPlayerIds = savedTeam.teamMembers.filter((playerId)=>{
                //     return !itemToBeRemoved.includes(playerId.toString());
                // })
                // savedTeam.teamMembers = savedPlayerIds

                // await savedTeam.save();
                // await Player.deleteOne({_id:itemToBeRemoved}) 

        }
        
    }catch(error){
        console.log(error);
    }
})