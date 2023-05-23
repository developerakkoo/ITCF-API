const {TeamAdminRoutes}  = require('./TeamAdmin.route');
const {TeamRoutes}= require('./team.route');
const {playerRoutes} = require('./player.route');
const {subMatterExRoutes} = require('./subMatterEx.route');
const {associateMemberRoutes}= require('./associateMember.route')

module.exports={
    TeamAdminRoutes,
    TeamRoutes,
    playerRoutes,
    subMatterExRoutes,
    associateMemberRoutes
}