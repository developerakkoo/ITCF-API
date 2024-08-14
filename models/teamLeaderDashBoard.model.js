const mongoose = require('mongoose');


const teamLeaderDashBoardSchema = mongoose.Schema({
team_Uid:{
    type:mongoose.Types.ObjectId,
    ref:'Team',
    require:true,
},
matches_played: {
    type:[mongoose.Types.ObjectId],
    ref:'Matches',
    require:true,
    default:[]
},
matches_Pending: {
    type:[mongoose.Types.ObjectId],
    ref:'Matches',
    require:true,
    default:[]
},
matches_won: {
    type:[mongoose.Types.ObjectId],
    ref:'Matches',
    require:true,
    default:[]
},
matches_lost: {
    type:[mongoose.Types.ObjectId],
    ref:'Matches',
    require:true,
    default:[]
},
net_run_rate: {
    type: String,
    require:true,
    default:0
},
points: {
    type: Number,
    require:true,
    default:0
},
createdAt: {
    type: Date,
    default: () => Date.now()
},
updatedAt: {
    type: Date,
    default: () => Date.now()
},
},);


module.exports = mongoose.model("teamLeaderDashBoard",teamLeaderDashBoardSchema);