const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const TeamAdminSchema = mongoose.Schema({
superAdminID:{
    type: mongoose.Types.ObjectId,
    ref: "superAdmin"
    
},
subAdminID:{
    type: mongoose.Types.ObjectId,
    ref: "subAdmin"
    
},
UID:{
    type:String,
    require:true
},
fName:{
    type:String,
    required: true
},
lName:{
    type:String,
    required: true
},
age:{
    type:String,
    required: true
},
DOB:{
    type:String,
    required: true
},
email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    unique: true,
    isEmail: true,
},
Phone:{
    type:Number,              
    required: [true, 'Phone number is required'],
    unique: true,
    minLength:10
},
Skills: {
    type: String,
    default:"-"
},
isActive: {
    type: Boolean,
    default:false
},
isBlocked: {
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

TeamAdminSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("TeamAdmin",TeamAdminSchema);