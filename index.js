const mongoose = require('mongoose');
const express= require('express');
const cors = require('cors');
require('dotenv').config();
const inviteLink = require('./controller/player.controller');
const {TeamAdminRoutes,TeamRoutes,paymentRoutes,OTPRoutes,associateMemberRoutes,subAdminRoutes,superAdminRoutes,subMatterExRoutes,playerRoutes}= require ('./routes/index.routes');
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



app.route('/inviteLink/:AdminID/:teamName/:teamAdminUID').get(inviteLink.handelGet).post(inviteLink.handelPost)



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

