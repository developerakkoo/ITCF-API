const Req = require('../models/proPlayerReq.model');


exports.getAllRequest = async(req,res) =>{
    try {
        const savedReq = await Req.find();
        if (savedReq.length == 0) {
            return res.status(404).json({message:'Request Not Found',statusCode:404});
        }
        res.status(200).json({message:'All Request Fetched Successfully',statusCode:200,length:savedReq.length,data:savedReq});
    } catch (error) {
        res.status(500).json({message:error.message,statuscode:500,status:'ERROR'});
    }
}

exports.getRequestById = async(req,res) =>{
    try {
        const savedReq = await Req.findOne({_id:req.params.reqId}).populate('playerID')
        if (!savedReq) {
            return res.status(404).json({message:'Request Not Found',statusCode:404});
        }
        res.status(200).json({message:'Request Fetched Successfully',statusCode:200,length:savedReq.length,data:savedReq});
    } catch (error) {
        res.status(500).json({message:error.message,statuscode:500,status:'ERROR'});
    }
}


exports.getRequestByUserId = async(req,res) =>{
    try {
        const savedReq = await Req.findOne({playerID:req.params.userId}).populate('playerID')
        if (!savedReq) {
            return res.status(404).json({message:'Request Not Found',statusCode:404});
        }
        res.status(200).json({message:'Request Fetched Successfully',statusCode:200,length:savedReq.length,data:savedReq});
    } catch (error) {
        res.status(500).json({message:error.message,statuscode:500,status:'ERROR'});
    }
}

exports.deleteRequest = async(req,res) =>{
    try {
        const savedReq = await Req.findOne({_id:req.params.reqId});
        if (!savedReq) {
            return res.status(404).json({message:'Request Not Found',statusCode:404});
        }
        await savedReq.deleteOne({_id:req.params.reqId});
        res.status(200).json({message:'Request Deleted Successfully',statusCode:200});
    } catch (error) {
        res.status(500).json({message:error.message,statuscode:500,status:'ERROR'});
    }
}