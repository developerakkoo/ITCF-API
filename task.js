require('dotenv').config();
const accountSid = 'AC3d2a984af8fb85d9e453ebb54477de6c';
const authToken = process.env.auth_Token;
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'hello',
        from: '+15416232876',
        to: '+919637957346'
    })
    .then(message => console.log(message.sid))