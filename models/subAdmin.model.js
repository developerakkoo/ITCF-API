const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subAdminSchema = new Schema({
    superAdminID:{
        type: mongoose.Types.ObjectId,
        ref: "superAdmin"
    },
    subAdminID:{
        type: mongoose.Types.ObjectId,
        ref: "subAdmin"
    },
    email:{
        type: String,
        required: [true, 'Password is required'],
        unique: true
    },
    Phone:{
        type:Number,              
        required: [true, 'Phone number is required'],
        unique: true,
        minLength:10
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    isActive:{
        type: Boolean,
        default: false
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    /*sub Admin Access*/
    canCreateSubAdmin:{
            type: Boolean,
            default: false
    },
    canUpdateSubAdmin:{
            type: Boolean,
            default: false
    },
    canNotifySubAdmin:{
            type: Boolean,
            default: false
    },
    canGetSubAdmin:{
            type: Boolean,
            default: false
    },
    canDeleteSubAdmin:{
            type: Boolean,
            default: false
    },
    canBlockSubAdmin:{
            type: Boolean,
            default: false
    },
    /*Team Admin Access*/
    canCreateTeamAdmin:{
        type: Boolean,
        default: false
    },
    canUpdateTeamAdmin:{
        type: Boolean,
        default: false
    },
    canNotifyTeamAdmin:{
        type: Boolean,
        default: false
    },
    canGetTeamAdmin:{
        type: Boolean,
        default: false
    },
    canDeleteTeamAdmin:{
        type: Boolean,
        default: false
    },
    canBlockTeamAdmin:{
        type: Boolean,
        default: false
    },
    /*Team  Access*/
    canCreateTeam:{
        type: Boolean,
        default: false
    },
    canUpdateTeam:{
        type: Boolean,
        default: false
    },
    canNotifyTeam:{
        type: Boolean,
        default: false
    },
    canGetTeam:{
        type: Boolean,
        default: false
    },
    canDeleteTeam:{
        type: Boolean,
        default: false
    },
    canBlockTeam:{
        type: Boolean,
        default: false
    },
    /*Player  Access*/
    canCreatePlayer:{
        type: Boolean,
        default: false
    },
    canUpdatePlayer:{
        type: Boolean,
        default: false
    },
    canNotifyPlayer:{
        type: Boolean,
        default: false
    },
    canGetPlayer:{
        type: Boolean,
        default: false
    },
    canDeletePlayer:{
        type: Boolean,
        default: false
    },
    canBlockPlayer:{
        type: Boolean,
        default: false
    },
    /*SubMatterEx  Access*/
    canCreateSubMatterEx:{
        type: Boolean,
        default: false
    },
    canUpdateSubMatterEx:{
        type: Boolean,
        default: false
    },
    canNotifySubMatterEx:{
        type: Boolean,
        default: false
    },
    canGetSubMatterEx:{
        type: Boolean,
        default: false
    },
    canDeleteSubMatterEx:{
        type: Boolean,
        default: false
    },
    canBlockSubMatterEx:{
        type: Boolean,
        default: false
    },

    /*AssociateMember  Access*/
    canCreateAssociateMember:{
        type: Boolean,
        default: false
    },
    canUpdateAssociateMember:{
        type: Boolean,
        default: false
    },
    canNotifyAssociateMember:{
        type: Boolean,
        default: false
    },
    canGetAssociateMember:{
        type: Boolean,
        default: false
    },
    canDeleteAssociateMember:{
        type: Boolean,
        default: false
    },
    canBlockAssociateMember:{
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    },
});




module.exports = mongoose.model('subAdmin', subAdminSchema);

