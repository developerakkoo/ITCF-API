const mongoose = require('mongoose');


const superAdminSchema = mongoose.Schema({
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
password: {
    type: String,
    require:true
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


module.exports = mongoose.model("superAdmin",superAdminSchema);