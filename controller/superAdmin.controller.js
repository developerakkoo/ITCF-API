const superAdmin =  require('../models/superAdmin.model');
const TeamAdmin = require('../models/TeamAdmin.model');
const Team =  require('../models/Team.model');
const associateMember =require('../models/associateMember.model');
const subMatterEx =  require('../models/subMatterEx.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
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
            message: 'supperAdmin with email Already Exists'
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
                text:`You'r successfully register as super Admin`
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
            return res.status(201).json({message: 'Admin Created Successfully!', status: '201', userId: result._id});
        })
    
.catch(error =>{
    if(error.code == 11000){
        return res.status(500).json({message: `user with this information is already exist please try with another email or Mobile Number` })
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
            const error = new Error('Admin not found');
            error.status = 404;
            next(error);
        }
        loadedUser = supperAdmin;
        bcrypt.compare(password, supperAdmin.password)
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

async function UpdateSuperAdmin(req,res){
    try{
        const ID = req.params.Id;
        // console.log(req.body)
        const savedSuperAdmin = await superAdmin.findOne({_id:ID});
        if (!savedSuperAdmin){
            return res.status(400).json({message: "User Not found"});
        }
        savedSuperAdmin.email=req.body.email ? req.body.email : savedSuperAdmin.email;  
        savedSuperAdmin.Phone=req.body.Phone ? req.body.Phone : savedSuperAdmin.Phone;

        const updateSuperAdmin = await savedSuperAdmin.save()

        return res.status(200).json({ updateSuperAdmin,message: "SuperAdmin  Updated Successfully"})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `User with this email or phone number  is already exist please try with different  email or phone number ` })
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
    return res.status(400).json({message: `user already exist with email adders!${req.body.email}`})
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
    res.status(201).json({message: `Team Admin created Successfully UID is send to register email!`,postResponse})
}catch(err){
    if(err.code == 11000){
        return res.status(400).json({message: `User with this email or phone number  is already exist please try with different  email or phone number ` })
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

        res.status(201).json({message:`AssociateMember Created successfully`,AssociateMemberCreated})
    }catch(err){
        console.log(err)
        if(err.code == 11000){
            return res.status(500).json({message: `AssociateMember with this information is already exist please try with another name or Mobile Number` })
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
        return res.status(400).json({message: `User with this email or phone number is already exist please try with different  email or phone number `})
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
        return res.status(201).json({message: `User created Successfully`,UserCreated})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `User with this email or phone number is already exist please try with different  email or phone number ` })
        }
        console.log("Something went wrong while saving to DB", err);
        res.status(500).json({message:err.message,status:"ERROR"})
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
    signUpMatterEx
}