const Team =  require('../models/Team.model');
const TeamAdmin = require('../models/TeamAdmin.model')
const APIFeatures =  require('../utils/ApiFeature')
const mongoosePaginate = require('mongoose-paginate');

async function  postTeam(req,res){
    // console.log(">>>>>>",req.body)
const teamObj ={
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
    const savedAdmin = await TeamAdmin.findOne({_id:AdminID});
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

async function UpdateTeam(req,res){
    try{
        const ID = req.params.Id;
        // console.log(req.body)
        const savedTeam = await Team.findOne({_id:ID});
        if (!savedTeam){
            return res.status(404).json({message: "Team Not found"});
        }
        savedTeam.teamName=req.body.name ? req.body.name : savedTeam.teamName;
        savedTeam.teamCity=req.body.city ? req.body.city : savedTeam.teamCity;
        
        const updateTeam = await savedTeam.save()

        return res.status(202).json({ updateTeam,message: "Team  Updated Successfully"})
    }catch(err){
        if(err.code == 11000){
            return res.status(400).json({message: `Team with this Team Name is already exist please try with different  Team Name` })
        }
        console.log(err)
        res.status(500).json({message: err.message,Status:`ERROR`});
    }
}

async function getAllTeam(req,res){
    try{
        const pageNumber = req.query.page || 1; // Get the current page number from the query parameters
        const pageSize = 10; // Number of items per page
        
        Team.paginate({}, { page: pageNumber, limit: pageSize }, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error occurred while fetching Data.' });
        }
        
        const { docs, total, limit, page, pages } = result;
        res.json({ Team: docs, total, limit, page, pages });
        });
    }catch(err){
        res.status(500).json({message: err.message, status:`ERROR`});
    }
}

async function getTeamById(req,res){
    try{
        const savedTeam= await Team.findOne({_id:req.params.Id})
        if (!savedTeam){
            return res.status(404).json({message: "Team Not found"});
        }
        res.status(200).json({ savedTeam,message: "Team  fetched Successfully"})
    }catch(err){
        res.status(500).json({message: err.message, status:`ERROR`});
    }
}


async function DeleteTeam(req,res){
    try{
        const savedTeam= await Team.findOne({_id:req.params.Id})
        if (!savedTeam){
            return res.status(404).json({message: "Team Not found"});
        }
        const deletedTeam = await Team.deleteOne({_id:req.params.Id})
        res.status(200).json({ message: `Team  Deleted Successfully with ID: ${req.params.Id}`})
    }catch(err){
        res.status(500).json({message: err.message,status:"ERROR" });
    }
}

async function teamSearchOption (req, res, next) {

    try {
        const query = req.query.query;
        const term = req.query.term;
        console.log(query + term);
        const features = await new APIFeatures(Team.find().populate('AdminID'), req.query)
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
    res.status(404).json({message: err.message, status:`ERROR`});
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
        res.status(200).json({label:`totalTeam`,count})
    }catch(err){
        res.status(500).json({message:err.message,status:'ERROR'})
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
        res.status(200).json({label:`totalTeamReport`,Data})
    }catch(err){
        res.status(500).json({message:err.message,status:`ERROR` })
    }
}

module.exports={
    postTeam,
    UpdateTeam,
    getAllTeam,
    getTeamById,
    DeleteTeam,
    teamSearchOption,
    totalTeamReport,
    totalTeamCount

}
