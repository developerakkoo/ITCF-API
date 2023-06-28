const moment = require('moment');
const Team =  require('../models/Team.model');
const Player = require('../models/player.mode');
const TeamAdmin = require('../models/TeamAdmin.model')
const cron = require('node-cron');
const nodemailer = require('nodemailer');
let msg = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
    }
}); 


cron.schedule('* * * * *',async () =>{
    try{
            console.log('>>');
            const date = '03-07-2023'//moment().format('DD-MM-YYYY');
        const savedPlayer = await Player.find({
            isAcceptInvite: false,
            notify:false,
            notifyDate:date
        })
        
        if (savedPlayer.length == 0){
            console.log("Players Not Found");
        }
        savedPlayer.forEach(async(player) => {
            const savedAdmin = await TeamAdmin.find({_id:player.AdminID})
            console.log(savedAdmin[0].email);
                    if (savedPlayer.length == 0){
            console.log("Players Not Found");
        }    let mailOptions = {
            from: 'serviceacount.premieleague@gmail.com',
            to: savedAdmin[0].email,
            subject:'Update ' ,
            text:`${player.Name}, Not Competed there registration process `
        };
        msg.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
        });
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
let D = '05-07-2023'
cron.schedule('* * * * *',async () =>{
    try{
        console.log('here>>');
        const savedPlayer = await Player.find({
            isAcceptInvite: false,
            notify:true,
            deleteDate: D//moment().format('DD-MM-YYYY')
        })
        if (savedPlayer.length == 0){
            console.log("Players Not Found");
        }
        for(player of savedPlayer){
            console.log('id',player._id);
            const savedTeam= await Team.findOne({teamMembers:player._id})
            // console.log('playerId',player._id);
            // console.log(savedTeam);
            // console.log('st',savedTeam['teamMembers']);

            // for(team of savedTeam ){
                let itemToBeRemoved = player._id.toString()  
                console.log('rmi',itemToBeRemoved);
                // // console.log(itemToBeRemoved);
                
                // // console.log("t",team.teamMembers);
                // if (!savedPlayer) {
                //     continue;
                // }
                let savedPlayerIds = savedTeam.teamMembers.filter((playerId)=>{
                    return !itemToBeRemoved.includes(playerId.toString());
                })
                savedTeam.teamMembers = savedPlayerIds
                // await savedTeam['teamMembers'].splice(savedTeam['teamMembers'].findIndex(a => a.id === itemToBeRemoved) , 1)
                   // Deleting Player Form Team
                await savedTeam.save();
                await Player.deleteOne({_id:itemToBeRemoved}) 
            // }

            // await Player.delete({_id:player._id})
        }
        console.log(`Count of undeleted Player: ${savedPlayer.length}`)
        // console.log(`unsent notification: ${savedPlayer}`)
    }catch(error){
    }
})