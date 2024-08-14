const Matches = require('../models/matches.model');
const teamLeaderDash = require('../models/teamLeaderDashBoard.model');
const APIFeatures = require('../utils/ApiFeature');
const moment = require('moment');



async function createMatch(req,res){
    try {
        const matchObj ={
            matchId:moment().format('dd').split('')[0]+Math.ceil(Math.random() * 100000+1984567),
            team1_Uid:req.body.team1Uid,
            team2_Uid:req.body.team2Uid,
            playingFormat:req.body.playingFormat,
            dateOfTheGame:req.body.dateOfTheGame,
            time:req.body.time,
            venue:req.body.venue,
        }
        const createdMatch = await Matches.create(matchObj);
        const savedTeam1Dash = await teamLeaderDash.findOne({team_Uid:req.body.team1Uid});
        const savedTeam2Dash = await teamLeaderDash.findOne({team_Uid:req.body.team2Uid});
        
        if (!savedTeam1Dash) {
            const teamDash ={
                team_Uid:createdMatch.team1_Uid,
                matches_Pending:createdMatch._id
            }
            await teamLeaderDash.create(teamDash);
        }
        if (savedTeam1Dash) {
            savedTeam1Dash.matches_Pending.push(createdMatch._id)
            await savedTeam1Dash.save();
        }
        if (!savedTeam2Dash) {
            const teamDash ={
                team_Uid:createdMatch.team2_Uid,
                matches_Pending:createdMatch._id
            }
            await teamLeaderDash.create(teamDash);
        }
        if (savedTeam2Dash) {
            savedTeam2Dash.matches_Pending.push(createdMatch._id)
            await savedTeam2Dash.save();
        }
        res.status(200).json({message:'Match Created Successfully',data:createdMatch});
    } catch (error) {
        console.log();
        res.status(500).json({message: error.message});
    }
}


async function updateMach(req,res){
    try {
        const Id = req.body.matchId
        const savedMatch = await Matches.findById(Id);
        savedMatch.playingFormat = req.body.playingFormat != undefined
        ? req.body.playingFormat 
        : savedMatch.playingFormat;
        
        savedMatch.dateOfTheGame = req.body.dateOfTheGame != undefined
        ? req.body.dateOfTheGame 
        : savedMatch.dateOfTheGame;
        
        savedMatch.time = req.body.time != undefined
        ? req.body.time 
        : savedMatch.time;
        
        savedMatch.venue = req.body.venue != undefined
        ? req.body.venue 
        : savedMatch.venue;  

        savedMatch.matchScoreSheetLink = req.body.matchScoreSheetLink != undefined
        ? req.body.matchScoreSheetLink 
        : savedMatch.matchScoreSheetLink;  

        savedMatch.matchRecordingLink = req.body.matchRecordingLink != undefined
        ? req.body.matchRecordingLink 
        : savedMatch.matchRecordingLink;  

        const updatedMatch = await savedMatch.save();
        res.status(200).json({message:'Match Updated Successfully',data:updatedMatch});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

async function getAllMatches(req,res){
    try {
        const pageNo = parseInt(req.query.page) || 1;
        const items_per_page = parseInt(req.query.items_per_page) || 10;
        const savedMatches = await Matches.find() .skip(( pageNo-1)*items_per_page ).limit(items_per_page);
        if (savedMatches.length == 0) {
            return res.status(404).json({message:'Matches Not Found',data:savedMatches});
        }
        res.status(200).json({message:'Matches Fetched Successfully',data:savedMatches,count:await Matches.find().count(),pageNo: pageNo });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

async function getMatchById(req,res){
    try {
        // console.log(req.params.Id);
        const ID = req.params.Id
        const savedMatches = await Matches.findById(ID).populate('team1_Uid')  .populate('team2_Uid');
        if (!savedMatches) {
            return res.status(404).json({message:'Match Not Found'});
        }
        res.status(200).json({message:'Match Fetched Successfully',data:savedMatches});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

async function getMatchByMatchId(req,res){
    try {
        const Id = req.params.matchId
        const savedMatches = await Matches.findOne({matchId:Id}).populate('team1_Uid')  .populate('team2_Uid');
        if (!savedMatches) {
            return res.status(404).json({message:'Match Not Found'});
        }
        res.status(200).json({message:'Match Fetched Successfully',data:savedMatches});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

async function matchSearchOption (req, res, next) {
    try {
        const query = req.query.query;
        const term = req.query.term;
        console.log(query + term);
        const features = await new APIFeatures(Matches.find().populate('team1_Uid')  .populate('team2_Uid'), req.query)
        .filter()
        .sort()

        const matches = await features.query;

        res.status(200).json({
        status: "success",
        statusCode: 200,
        count: matches.length,
        data: matches,
        });
    } catch (err) {
        console.log(err)
    res.status(500).json({message: err.message,statusCode:'500', status:`ERROR`});
    }
};

async function updateMachStatus(req,res){
    try {
        const matchId = req.body.matchId
        const savedMatch = await Matches.findById(matchId);
        const team1 = await teamLeaderDash.findOne({team_Uid:savedMatch.team1_Uid});
        const team2 = await teamLeaderDash.findOne({team_Uid:savedMatch.team2_Uid});

        if (savedMatch.match_status == req.body.match_status) {
            return res.status(400).json({message:"Match Status Already Updated!"})
        }
        const itemToBeRemoved = matchId.toString();
        if (req.body.match_status == 1) {
            savedMatch.match_status = req.body.match_status != undefined
            ? req.body.match_status 
            : savedMatch.match_status;
            const updatedMatch = await savedMatch.save(); //updating match status
            if (team1.team_Uid == req.body.winnerTeamId) {
                team1.matches_Pending.splice(team1.matches_Pending.findIndex(a => a == itemToBeRemoved) , 1) // delete match from pending matches
                team2.matches_Pending.splice(team2.matches_Pending.findIndex(a => a == itemToBeRemoved) , 1)
                team1.matches_played.push(matchId);// add to matches played
                team2.matches_played.push(matchId);
                team1.matches_won.push(matchId);// winner 
                team1.points+=2 //points
                team2.points+=0
                team2.matches_lost.push(matchId);// loser
                await team1.save();
                await team2.save();
                return res.status(200).json({message:'Match Updated Successfully',data:updatedMatch});
            }
            if (team2.team_Uid == req.body.winnerTeamId) {
                team1.matches_Pending.splice(team1.matches_Pending.findIndex(a => a == itemToBeRemoved) , 1) // delete match from pending matches
                team2.matches_Pending.splice(team2.matches_Pending.findIndex(a => a == itemToBeRemoved) , 1)
                team1.matches_played.push(matchId); // add to matches played
                team2.matches_played.push(matchId);
                team2.matches_won.push(matchId); // winner 
                team2.points+=2  //points
                team1.points+=0
                team1.matches_lost.push(matchId); // loser
                await team1.save();
                await team2.save();
                return res.status(200).json({message:'Match Updated Successfully',data:updatedMatch});
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

module.exports={
    createMatch,
    updateMach,
    getAllMatches,
    getMatchById,
    getMatchByMatchId,
    matchSearchOption,
    updateMachStatus
}