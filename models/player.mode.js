const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
    superAdminID:{
        type: mongoose.Types.ObjectId,
        ref: "superAdmin"
        
    },
teamAdminUID:{
    type:String,
    required: true
},
AdminID:{
    type: Schema.Types.ObjectId,
    ref: "TeamAdmin"
},
teamID:{
    type:Schema.Types.ObjectId,
    ref: "Team"
},
Name:{
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
    type : String,

},
isProfessionalMember:{
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
createdAt: {
    type: Date,
    default: () => Date.now()
},
updatedAt: {
    type: Date,
    default: () => Date.now()
},
},);

PlayerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Player",PlayerSchema);