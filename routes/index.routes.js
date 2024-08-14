const {TeamAdminRoutes}  = require('./TeamAdmin.route');
const {TeamRoutes}= require('./team.route');
const {playerRoutes} = require('./player.route');
const {subMatterExRoutes} = require('./subMatterEx.route');
const {associateMemberRoutes}= require('./associateMember.route');
const {superAdminRoutes} =  require('./superAdmin.route');
const{subAdminRoutes} = require('./subAdmin.route');
const {paymentRoutes} = require('./payment.route');
const {OTPRoutes} = require('./otpVerify.route');
const {RqsToProMemberRoutes} = require('./proPlayerReq.route');
const {matchesRoutes} = require('./matches.route');
const{teamLeaderDashRoutes} = require('./teamLeadDash.route')

module.exports={
    TeamAdminRoutes,
    TeamRoutes,
    playerRoutes,
    subMatterExRoutes,
    associateMemberRoutes,
    superAdminRoutes,
    subAdminRoutes,
    paymentRoutes,
    OTPRoutes,
    RqsToProMemberRoutes,
    matchesRoutes,
    teamLeaderDashRoutes
}