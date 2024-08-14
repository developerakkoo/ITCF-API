const mongoose = require('mongoose');


const matchesSchema = mongoose.Schema({
matchId: {
type: String,
required: true,
unique: true
},
team1_Uid:{
    type:mongoose.Types.ObjectId,
    ref:'Team',          
    required: true
},
team2_Uid: {
    type:mongoose.Types.ObjectId,
    ref:'Team',
    require:true
},
playingFormat: {
    type: String,
    require:true
},
dateOfTheGame: {
    type: String,
    require:true
},
time: {
    type: String,
    require:true
},
venue: {
    type: String,
    require:true
},
matchScoreSheetLink: {
    type: String,
    default:"__"
},
matchRecordingLink: {
    type: String,
    default:"__"
},
match_status: {
    type: String,
    require:true,
    default:0          // 0 = pending, 1 = complete, 2 = costume
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


module.exports = mongoose.model("Matches",matchesSchema);