const teamLeaderDash = require('../models/teamLeaderDashBoard.model');
const APIFeatures = require('../utils/ApiFeature');


async function getDash(req,res){
    try {
        const pipeline = 
        [
            {
                '$sort': {
                'points': -1
                }
            }
        ]
        const pageNo = parseInt(req.query.page) || 1;
        const items_per_page = parseInt(req.query.items_per_page) || 10;
        const savedTeam = await teamLeaderDash.aggregate(pipeline) .skip(( pageNo-1)*items_per_page ).limit(items_per_page);
        if (savedTeam.length == 0) {
            return res.status(404).json({message:'Team Leader Dashboard Not Found',data:savedMatches});
        }
        res.status(200).json({message:'Team Leader Dashboard Fetched Successfully',data:savedTeam,count:await teamLeaderDash.find().count(),pageNo: pageNo });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

async function getDashByTeamId(req,res){
    try {
        const ID = req.params.teamId
        const savedTeam = await teamLeaderDash.find({team_Uid:ID}).populate('team_Uid').populate('matches_Pending').populate('matches_played').populate('matches_won').populate('matches_lost');
        if (savedTeam.length == 0) {
            return res.status(404).json({message:'Team Dashboard Not Found'});
        }
        res.status(200).json({message:'Team Dashboard Fetched Successfully',data:savedTeam,matches_Pending:savedTeam[0].matches_Pending.length,matches_played:savedTeam[0].matches_played.length,matches_won:savedTeam[0].matches_won.length,matches_lost:savedTeam[0].matches_lost.length});
    } catch (error) {
        res.status(500).json({message: error.message});
        
    }
}

async function getDashById(req,res){
    try {
        const ID = req.params.Id
        const savedTeam = await teamLeaderDash.findById(ID).populate('team_Uid').populate('matches_Pending').populate('matches_played').populate('matches_won').populate('matches_lost');
        if (!savedTeam) {
            return res.status(404).json({message:'Team Dashboard Not Found'});
        }
        res.status(200).json({message:'Team Dashboard Fetched Successfully',data:savedTeam,matches_Pending:savedTeam.matches_Pending.length,matches_played:savedTeam.matches_played.length,matches_won:savedTeam.matches_won.length,matches_lost:savedTeam.matches_lost.length});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message});
        
    }
}

module.exports={
    getDash,
    getDashByTeamId,
    getDashById
}