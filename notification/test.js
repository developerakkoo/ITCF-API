const nodemailer = require('nodemailer');
require('dotenv').config();

let msg = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS_KEY
    }
});

let mailOptions = {
    from: 'serviceacount.premieleague@gmail.com',
    to: 'sakibdevlekar96@gmail.com',
    subject: 'notify',
    text: `1st test this mail is send by node js app`
};

msg.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
    console.log('Email sent: ' + info.response);
    }
});