const routes = require('express').Router();
const teamLeaderDash = require('../controller/teamLeaderDashBoard.controller');

routes.get('/get/team/leader-board',teamLeaderDash.getDash);

routes.get('/get/team/leader-board/byTeamId/:teamId',teamLeaderDash.getDashByTeamId);

routes.get('/get/team/leader-board/byId/:Id',teamLeaderDash.getDashById);











module.exports = {teamLeaderDashRoutes : routes}