const Team =  require('../models/Team.model');
const Notification = require('../models/Notification.model');
const TeamAdmin = require('../models/TeamAdmin.model')
const APIFeatures =  require('../utils/ApiFeature')
const mongoosePaginate = require('mongoose-paginate');

async function  postTeam(req,res){
    // console.log(">>>>>>",req.body)
const teamObj ={
    teamAdminUID:req.body.teamAdminUID,
    AdminID: req.body.AdminID,
    teamName: req.body.teamName,
    teamCity: req.body.teamCity,
    addressLine1: req.body.addressLine1,
    addressLine2: req.body.addressLine2,
    addressLine3: req.body.addressLine3,
    pinCode: req.body.pinCode,

    temp:"inviteLink"+"/"+req.body.AdminID+"/"+req.body.teamName+"/"+req.body.teamAdminUID,
}
    teamObj. inviteLink =req.protocol +"://"+req.hostname +"/"+teamObj.temp.replace(/\\/g, "/");
try{
    const admin = await TeamAdmin.findOne({UID:req.body.teamAdminUID});
    if(!admin){
    return res.status(404).json({message: `Team Admin UID Is Not Valid`,statusCode:'404'})
    }
    const savedAdmin = await TeamAdmin.findOne({_id:teamObj.AdminID});
    if(!savedAdmin){
    return res.status(404).json({message: `Team Admin  Is Not Valid`,statusCode:'404'})
    }
    const savedTeam = await Team.findOne({teamName:req.body.teamName});
    if(savedTeam){
    return res.status(404).json({message: `Team Name Already Exist  Please Try With Different Team Name`,statusCode:'404'})
    }
    const TeamACreated = await Team.create(teamObj)
    res.status(200).json({message: `Team  Created Successfully `,statusCode:'200',data:TeamACreated})
}catch(err){
    if(err.code == 11000){
        return res.status(500).json({message: `Team With This Team Name Is Already Exist Please Try With Different  Team Name`,statusCode:'500' })
    }
    console.log("Something went wrong while saving to DB", err);
    res.status(500).json({message:err.message,statusCode:'500',status:"ERROR"})
    }
}

async function postTeamLogo(req,res){
    try {
    
        const path = req.protocol +"://"+req.hostname +"/"+ req.file.path.replace(/\\/g, "/");
        const savedTeam = await Team.findOne({_id:req.params.teamId});
        if(!savedTeam){
        return res.status(404).json({message:`Team Not Found With This TeamId: ${req.params.teamId}`,statusCode:'404'});
        }
        savedTeam.teamLogo = path != undefined
        ? path
        : savedTeam.teamLogo
    
        const updatedTeam = await savedTeam.save();
        res.status(200).json({message:'teamLogo Uploaded Successfully',statusCode:'200',data:updatedTeam})
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message,statusCode:'500',status:"ERROR" });
    }
}

async function UpdateTeam(req,res){
    try{
        const ID = req.params.teamId;
        // console.log(req.body)
        const savedTeam = await Team.findOne({_id:ID});
        if (!savedTeam){
            return res.status(404).json({message: "Team Not Found"});
        }
        savedTeam.teamName=req.body.name ? req.body.name : savedTeam.teamName;
        savedTeam.teamCity=req.body.city ? req.body.city : savedTeam.teamCity;
        savedTeam.isBlocked = req.body.isBlocked != undefined
        ? req.body.isBlocked
        : savedTeam.isBlocked
        
        const updateTeam = await savedTeam.save()

        return res.status(201).json({ data:updateTeam,statusCode:'201',message: "Team  Updated Successfully"});
    }catch(err){
        if(err.code == 11000){
            return res.status(500).json({message: `Team With This Team Name Is Already Exist Please Try With Different  Team Name`,statusCode:'500' });
        }
        console.log(err)
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}

async function getAllTeam(req,res){
    try{
        const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
        const pageSize = 10; // Number of items per page
        
        Team.paginate({}, { page: pageNumber, limit: pageSize }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error occurred while fetching Data.' ,statusCode:'500'});
        }
        
        const { docs, total, limit, page, pages } = result;
        res.status(200).json({ data: docs, total, limit, page, pages,statusCode:'200' });
        });
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500', status:`ERROR`});
    }
}

async function getTeamById(req,res){
    try{
        const savedTeam= await Team.findOne({_id:req.params.teamId})
        if (!savedTeam){
            return res.status(404).json({message: "Team Not Found",statusCode:'404'});
        }
        res.status(200).json({data: savedTeam,message: "Team Fetched Successfully",statusCode:'200'})
    }catch(err){
        res.status(500).json({message: err.message, statusCode:'500',status:`ERROR`});
    }
}


async function DeleteTeam(req,res){
    try{
        const savedTeam= await Team.findOne({_id:req.params.teamId})
        if (!savedTeam){
            return res.status(404).json({message: "Team Not Found",statusCode:'404'});
        }
        await Team.deleteOne({_id:req.params.teamId})
        res.status(200).json({ message: `Team  Deleted Successfully with ID: ${req.params.teamId}`,statusCode:'200'})
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500',status:"ERROR" });
    }
}

async function teamSearchOption (req, res, next) {

    try {
        const query = req.query.query;
        const term = req.query.term;
        console.log(query + term);
        const features = await new APIFeatures(Team.find().populate('AdminID') .lean().populate('superAdminID','email'), req.query)
        .filter()
        .sort()

        const Teams = await features.query;

        res.status(200).json({
        status: "success",
        statusCode: 200,
        results: Teams.length,
        searchData: Teams,
        });
    } catch (err) {
        console.log(err)
    res.status(404).json({message: err.message, statusCode:'404',status:`ERROR`});
    }
};

async function totalTeamCount (req, res){
    const pipeline =[
        [
            {
            '$count': 'totalTeam'
            }
        ]
    ]
    try{
        const count = await Team.aggregate(pipeline);
        res.status(200).json({statusCode:'200',label:`totalTeam`,data:count})
    }catch(err){
        res.status(500).json({message:err.message,statusCode:'500',status:'ERROR'})
    }
}

async function totalTeamReport(req,res){
    const pipeline =[
        [
            {
            '$count': 'totalTeam'
            }
        ]
    ]
    const pipeline1 =[
        [
            {
                '$match': {
                    'isActive': false
                }
                },
                {
                    '$group': {
                        '_id': 'total Active Team', 
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
                    'isBlocked': false
                }
                },
                {
                    '$group': {
                        '_id': 'total Blocked Team', 
                        'value': {
                        '$count': {}
                        }
                    }
                }
        ]
    ]
    try{
        const count = await Team.aggregate(pipeline);
        const isActive = await Team.aggregate(pipeline1);
        const isBlocked = await Team.aggregate(pipeline2);

        let Data = [count[0],isActive[0],isBlocked[0]]
        res.status(200).json({statusCode:'200',label:`totalTeamReport`,data:Data})
    }catch(err){
        res.status(500).json({message:err.message,statusCode:'500',status:`ERROR` })
    }
}

async function getAllTeamNotification(req,res){
    try{
        const savedTeam = await Team.findOne({_id:req.params.userID});
        if (!savedTeam){
            return res.status(404).json({message: "Team Not Found",statusCode:'404'});
        }
        const message = await Notification.find({userID:req.params.userID})
        return res.status(200).json({message:'Notification Fetched Successfully',statusCode:'200',length:message.length ,data:message});
    }catch(err){
        res.status(500).json({message: err.message,statusCode:'500',Status:`ERROR`});
    }
}
    
async function getTeamNotification(req,res){
    try{
        const savedTeam = await Team.findOne({_id:req.params.userID});
        if (!savedTeam){
            return res.status(404).json({message: "Team Not Found",statusCode:'404'});
        }
        const message = await Notification.find({_id:req.params.msgID})
        return res.status(200).json({message:'Notification Fetched Successfully',length:message.length,statusCode:'200' ,data:message});
    }catch(err){
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}
    
async function deleteTeamNotification(req,res){
    try{
        const savedTeam = await Team.findOne({_id:req.params.userID});
        if (!savedTeam){
            return res.status(404).json({message: "Team Not Found",statusCode:'404'});
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

async function getTeamByPlayerId(req,res){
    try{
        const savedTeam= await Team.find({teamMembers:req.params.PlayerId})
        if (savedTeam.length == 0){
            return res.status(404).json({message: "Team Not Found With This User",statusCode:'404'});
        }
        res.status(200).json({message: "Team Fetched Successfully",statusCode:'200',length:savedTeam.length,data: savedTeam})
    }catch(err){
        res.status(500).json({message: err.message, statusCode:'500',status:`ERROR`});
    }
}

module.exports={
    postTeam,
    postTeamLogo,
    UpdateTeam,
    getAllTeam,
    getTeamById,
    DeleteTeam,
    teamSearchOption,
    totalTeamReport,
    totalTeamCount,
    getAllTeamNotification,
    getTeamNotification,
    deleteTeamNotification,
    getTeamByPlayerId

}
