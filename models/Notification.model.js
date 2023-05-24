const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
superAdminID:{
    type: mongoose.Types.ObjectId,
    ref: "superAdmin"
    
},
teamAdminID:{
    type: Schema.Types.ObjectId,
    ref: "TeamAdmin"
},
teamID:{
    type:Schema.Types.ObjectId,
    ref: "Team"
},
PlayerID:{
    type:Schema.Types.ObjectId,
    ref: "Player"
},
SubMatterExID:{
    type:Schema.Types.ObjectId,
    ref: "SubMatterEx"
},
associateMemberID:{
    type:Schema.Types.ObjectId,
    ref: "associateMember"
},
message:{
    type:String,
    require:true
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

NotificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Notification",NotificationSchema);