const mongoose = require('mongoose');
const express= require('express');
const cors = require('cors');
require('dotenv').config();
// require('./tempCodeRunnerFile');
require('./controller/cron');
const inviteLink = require('./controller/player.controller');
const {RejectLinkHandelGet,RejectLinkHandelPost} =require('./controller/TeamAdmin.controller')
const {
    TeamAdminRoutes,
    TeamRoutes,
    RqsToProMemberRoutes,
    paymentRoutes,
    OTPRoutes,
    associateMemberRoutes,
    subAdminRoutes,
    superAdminRoutes,
    subMatterExRoutes,
    playerRoutes,
    matchesRoutes,
    teamLeaderDashRoutes
    }= require ('./routes/index.routes');
const path= require('path');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));
app.use( express.static('public'));
app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, 'public')));





//      rotes
app.use(paymentRoutes);
app.use(TeamAdminRoutes);
app.use(TeamRoutes);
app.use(playerRoutes);
app.use(subMatterExRoutes);
app.use(associateMemberRoutes);
app.use(superAdminRoutes);
app.use(subAdminRoutes);
app.use(OTPRoutes);
app.use(RqsToProMemberRoutes);
app.use(matchesRoutes);
app.use(teamLeaderDashRoutes);



app.route('/inviteLink/:AdminID/:teamName/:teamAdminUID').get(inviteLink.handelGet).post(inviteLink.handelPost)

app.route('/Reject-Link/:AdminID/:teamId').get(RejectLinkHandelGet).post(RejectLinkHandelPost)

app.all("*", (req, res, next) => {
    res.status(404).json({
        message:"Page not found"
    });
});
mongoose.connect(process.env.DB_URL,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
const db = mongoose.connection
db.on("error", () => console.log("ERROR while connecting to DB"))  //code for connecting mongodb
db.once("open", () => {console.log("Connected to mongoDB ")
})


app.listen(8000,()=> 
console.log('Running at localhost:8000 🚀'));




// player log in akk route take a number true   put  email and password login 






//https://www.figma.com/file/A6wmwbf97TVC79IegV3QQK/ITCF?type=whiteboard&node-id=0-1&t=yy3nISDFLg1kC5cu-0