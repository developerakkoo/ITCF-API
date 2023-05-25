const mongoose = require('mongoose');
const express= require('express');
require('dotenv').config();
const {TeamAdminRoutes,TeamRoutes,associateMemberRoutes,subAdminRoutes,superAdminRoutes,subMatterExRoutes,playerRoutes}= require ('./routes/index.routes');
const path= require('path');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended:false}));
app.use( express.static('public'));
app.use("/public", express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname, 'public')));



//      rotes

app.use(TeamAdminRoutes);
app.use(TeamRoutes);
app.use(playerRoutes);
app.use(subMatterExRoutes);
app.use(associateMemberRoutes);
app.use(superAdminRoutes);
app.use(subAdminRoutes);

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






