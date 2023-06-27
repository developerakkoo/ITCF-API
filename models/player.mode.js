const moment = require('moment/moment');
const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate');



const PlayerSchema = mongoose.Schema({
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
},
AdminID:{
    type: mongoose.Types.ObjectId,
    ref: "TeamAdmin"
},
teamID:{
    type:mongoose.Types.ObjectId,
    ref: "Team"
},
Name:{
    type:String,
    required: true
},
image:{
    type:String,
    default:""
},
age:{
    type:String,
    // required: true
},
DOB:{
    type:String,
    // required: true
},
email: {
    type: String,
    // required: [true, 'Email is required'],
    lowercase: true,
    // unique: true,
    isEmail: true,
},
Password:{
    type:String,

},
Phone:{
    type:Number,
    required: [true, 'Phone number is required'],
    unique: true,
},
Skills: {
    type : String,

},
isProfessionalMember:{
    type: Boolean,
    default : false
},
isFeePaid:{
    type: Boolean,
    default : false
},
isActive: {
    type: Boolean,
    default : false

},
isBlocked: {
    type : Boolean,
    default : false

},
isAcceptInvite: {
    type : Boolean,
    default : false

},
notify: {
    type : Boolean,
    default : false

},
notifyDate:{
    type:String,
    default:moment().add(5,'day').format('DD-MM-YYYY')
},
deleteDate:{
    type:String,
    default:moment().add(7,'day').format('DD-MM-YYYY')
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

// PlayerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Player",PlayerSchema);