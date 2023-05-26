const subAdmin =  require('../models/subAdmin.model');

const validateSubAdmin = async (req,res,next) => {
    if (!req.body.email ){
        return res.status(403).send({
            message: "email  is require"
        })
    }
    else if (!req.body.Phone ){
        return res.status(403).send({
            message: "Phone number is require"
        })
    }
    else if (!req.body.password ){
        return res.status(403).send({
            message: "password  is require"
        })
    }
    else{
        next();
    }
}

const isSubAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}

const canCreateSubAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canCreateSubAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}

const canUpdateSubAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canUpdateSubAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canNotifySubAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canNotifySubAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canGetSubAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canGetSubAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canDeleteSubAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canDeleteSubAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canBlockSubAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canBlockSubAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}

//   Team Admin
const canCreateTeamAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canCreateTeamAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canUpdateTeamAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canUpdateTeamAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canNotifyTeamAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canNotifyTeamAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canGetTeamAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canGetTeamAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canDeleteTeamAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canDeleteTeamAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canBlockTeamAdmin = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canBlockTeamAdmin === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}

// Team
const canCreateTeam = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canCreateTeam === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canUpdateTeam = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canUpdateTeam === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canNotifyTeam = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canNotifyTeam === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canGetTeam = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canGetTeam === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canDeleteTeam = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canDeleteTeam === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canBlockTeam = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canBlockTeam === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}

//   Player
const canCreatePlayer = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canCreatePlayer === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canUpdatePlayer = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canUpdatePlayer === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canNotifyPlayer = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canNotifyPlayer === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canGetPlayer = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canGetPlayer === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canDeletePlayer = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canDeletePlayer === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canBlockPlayer = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canBlockPlayer === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}

//    SubMatterEx

const canCreateSubMatterEx = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canCreateSubMatterEx === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canUpdateSubMatterEx = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canUpdateSubMatterEx === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canNotifySubMatterEx = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canNotifySubMatterEx === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canGetSubMatterEx = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canGetSubMatterEx === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}

const canDeleteSubMatterEx = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canDeleteSubMatterEx === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canBlockSubMatterEx = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canBlockSubMatterEx === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}

//    AssociateMember

const canCreateAssociateMember = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canCreateAssociateMember === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canUpdateAssociateMember = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canUpdateAssociateMember === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canNotifyAssociateMember = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canNotifyAssociateMember === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canGetAssociateMember = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canGetAssociateMember === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canDeleteAssociateMember = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canDeleteAssociateMember === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}
const canBlockAssociateMember = async (req,res,next) => {
    const savedAdmin = await subAdmin.findOne({ _id: req.params.Id})
        if(!savedAdmin.canBlockAssociateMember === true){
            res.status(400).json({
            status: false,
            message: `Sorry, You doe's not have a subAdmin rights!`
        });
    } else{
        next();
    }
}

module.exports ={
    validateSubAdmin,
    isSubAdmin,
    canCreateSubAdmin,
    canUpdateSubAdmin,

    /*sub Admin Access*/
    canCreateSubAdmin,
    canUpdateSubAdmin,
    canNotifySubAdmin,
    canGetSubAdmin,
    canDeleteSubAdmin,
    canBlockSubAdmin,
    
    /*Team Admin Access*/
    canCreateTeamAdmin,
    canUpdateTeamAdmin,
    canNotifyTeamAdmin,
    canGetTeamAdmin,
    canDeleteTeamAdmin,
    canBlockTeamAdmin,

    /*Team  Access*/
    canCreateTeam,
    canUpdateTeam,
    canNotifyTeam,
    canGetTeam,
    canDeleteTeam,
    canBlockTeam,

    /*Player  Access*/
    canCreatePlayer,
    canUpdatePlayer,
    canNotifyPlayer,
    canGetPlayer,
    canDeletePlayer,
    canBlockPlayer,

    /*SubMatterEx  Access*/
    canCreateSubMatterEx,
    canUpdateSubMatterEx,
    canNotifySubMatterEx,
    canGetSubMatterEx,
    canDeleteSubMatterEx,
    canBlockSubMatterEx,

    /*AssociateMember  Access*/
    canCreateAssociateMember,
    canUpdateAssociateMember,
    canNotifyAssociateMember,
    canGetAssociateMember,
    canDeleteAssociateMember,
    canBlockAssociateMember
}