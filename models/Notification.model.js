const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    superAdminID:{
        type: mongoose.Types.ObjectId,
        ref: "superAdmin"
        
    },
    subAdminID:{
        type: mongoose.Types.ObjectId,
        ref: "subAdmin"
        
    },
userID:{
    type: String,
    require:true
    
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