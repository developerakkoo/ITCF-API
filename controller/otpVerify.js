require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;

const verifySid = process.env.TWILIO_VERIFY_SID;
const client = require('twilio')(accountSid,'edbbe84cd5c2c75be66701dd09c42ece');


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
            if (success.valid === true && success.status === "approved" ) {
            return res.status(200).json({postObj});   
            }
            res.status(400).json({message:`Please Enter Valid Otp Or Mobile Number`})
            
        }).catch((error) => {
            res.status(500).json({status:'error' , message: error.message})
        })
    }