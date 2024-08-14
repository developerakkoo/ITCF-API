const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const TeamSchema = new Schema({
superAdminID:{
    type: mongoose.Types.ObjectId,
    ref: "superAdmin"
        
    },
subAdminID:{
    type: mongoose.Types.ObjectId,
    ref: "subAdmin"
        
    },
teamAdminUID:{
    type:String,
    required: true
},
AdminID:{
    type: Schema.Types.ObjectId,
    ref: "TeamAdmin"
},
teamLogo:{
    type:String,
    default:""
},
teamName:{
    type:String,
    required: true,
    unique:true
},
teamCity:{
    type:String,
    required: true,

},
addressLine1:{
    type:String,
    required: true,

},
addressLine2:{
    type:String
},
addressLine3:{
    type:String
},
pinCode:{
    type:Number,
    required: true,

},
city:{
    type:String,
    required: true,

},
state:{
    type:String,
    required: true,

},
teamMembers:{
    type:[mongoose.Types.ObjectId],
    ref:'Player'
},
inviteLink:{
    type:String
},
isActive: {
    type: Boolean,
    default:false
},
isBlocked: {
    type: Boolean,
    default:false
},
isPayForHolTeam: {
    type: Boolean,
    default:false
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

TeamSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Team",TeamSchema);

// address ,team logo ,team members   multiple player team add player image