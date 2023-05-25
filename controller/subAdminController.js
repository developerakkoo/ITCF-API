const subAdmin = require('../models/subAdmin.model');
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
        const features = await new APIFeatures(subAdmin.find() .lean().populate('superAdminID','email'), req.query)
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



module.exports = {
    postSignup,
    postLogin,
    UpdateSubAdmin,
    DeleteSubAdmin,
    subAdminSearchOption
}