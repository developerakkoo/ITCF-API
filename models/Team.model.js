const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const TeamSchema = new Schema({
teamAdminUID:{
    type:String,
    required: true
},
AdminID:{
    type: Schema.Types.ObjectId,
    ref: "TeamAdmin"
},
teamName:{
    type:String,
    required: true,
    unique:true
},
teamCity:{
    type:String,
    required:true
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

TeamSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Team",TeamSchema);