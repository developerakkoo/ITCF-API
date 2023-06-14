const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const SubMatterExSchema = new Schema({
    superAdminID:{
        type: mongoose.Types.ObjectId,
        ref: "superAdmin"
    },
    subAdminID:{
        type: mongoose.Types.ObjectId,
        ref: "subAdmin"
        
    },
Name:{
    type:String,
    required: true
},
Specialization:{
    type: String,
    require:true
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
password: {
    type: String
},
Phone:{
    type:Number,
    required: [true, 'Phone number is required'],
    unique: true,
    minLength:10
},
address:{
    type:String,
    required: true
},
Documents:{
    type:Array,
    default:[]
},
DocUrl:{
    type:Array,
    default:[]
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

SubMatterExSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("SubMatterEx",SubMatterExSchema);