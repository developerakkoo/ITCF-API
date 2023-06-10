require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;
const client = require('twilio')(accountSid,authToken);


const teamAdmin = require('../models/TeamAdmin.model');

    exports.getToken = async(req, res, next) => {
        const phonenumber = req.body.phonenumber;
        console.log("PHONE:- "+ phonenumber);
        client.verify.v2.services(verifySid)
        .verifications
        .create({
            to:"+91"+phonenumber,
            channel: 'sms'
        }).then((success) => {
        
            res.status(200).json({
                status: 'success',
                success: success,
            })
        }).catch((error) => {
            res.status(500).json({
                status: 'error',
                error: error,
                message: 'Something went wrong!'
            })
        })
    }
    
    
    // {lat:DataTransfer,
    // lng:dat}
    
    exports.verifyToken = async(req, res, next) => {
    
        const code = req.body.code;
        const phonenumber = req.body.phonenumber;
        const User = await teamAdmin.findOne({Phone:phonenumber})
        if(!User){
            return res.status(401).json({message: 'user not register !'})
        }
        const userID = User._id
        
        client.verify.v2.services(verifySid)
        .verificationChecks
        .create({
            
                to: "+91"+phonenumber,
                code: code
            
        }).then((success) => {
            const postObj ={
                UserID:userID,
                phoneNumber:success.to,
                status:success.status,
                Valid:success.valid
            }
                res.status(200).json({postObj})
            
        }).catch((error) => {
            res.status(401).json({status:'error' ,error, message: 'Something went wrong!'})
        })
    }