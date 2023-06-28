const mongoose = require('mongoose');

const proPlayerReqSchema = mongoose.Schema({
playerID:{
    type: mongoose.Types.ObjectId,
    ref: "Player",
    require:[true,'playerId is requirer']
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


module.exports = mongoose.model("ReqToProPlayer",proPlayerReqSchema);