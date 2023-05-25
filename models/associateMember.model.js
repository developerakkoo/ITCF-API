const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const associateMemberSchema = mongoose.Schema({
superAdminID:{
    type: mongoose.Types.ObjectId,
    ref: "superAdmin"
    
},
subAdminID:{
    type: mongoose.Types.ObjectId,
    ref: "subAdmin"
    
},
fName:{
    type:String,
    required: true
},
mName:{
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
ResidentialAddress: {
    type: String,
    require: true,
},
OfficeAddress: {
    type: String,
    
},
CricketingExperience:{
    type: String,
    require: true,
},
AdharCard:{
    type: String,
    require: true,
},
panCard:{
    type: String,
    require: true,
},
residentialProof:{
    type: String,
    require: true,
},
ITR:{
    type: String,
    require: true,
},
TandC:{
    type: Boolean,
    default:true
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

associateMemberSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("associateMember",associateMemberSchema);