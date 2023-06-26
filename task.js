/*task to be  complete*/

/* 

1) testing all rotes and  controller fot admin access 
*/


// max 15 user add in team  check
const accountSid = 'AC3d2a984af8fb85d9e453ebb54477de6c';
const authToken = 'b039392fd8fbd27bc451dffa92862133';
const client = require('twilio')(accountSid, authToken);

// // client.messages
// //     .create({
// //         body: 'Hello',
// //         from: 'whatsapp:+14155238886',
// //         to: 'whatsapp:+919028851449'
// //     })
// //     .then(message => console.log(message));

// const sendMessage = async (message, senderID) => {

//     try {
//         await client.messages.create({
//             to: senderID,
//             body: message,
//             from: `whatsapp:+14155238886`
//         });
//     } catch (error) {
//         console.log(`Error at sendMessage --> ${error}`);
//     }
// };
// sendMessage('hii','+919637957346')
// const cron = require('node-cron')
// const accountSid = 'AC6132606cae70c22c65e4a762389da781';
// const authToken = 'd61062c92e495d0dd63f330575725cd0';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//     .create({
//         body: 'hello',
//         from: '+13156934322',
//         to: '+919637957346'
//     })
//     .then(message => console.log(message.sid))
let userNo = 9637957346

// notifications.forEach(async (user) => {
// client.messages
//     .create({body: 'Hi there this msg from sakib', from: '+13156934322', to: '+91'+user.no})
//     .then(message => console.log(message.sid,'Message send.!'));
// })



    client.messages
    .create({body: `accept:${'AppLink'} rejectLink:${'1234'}`, from: '+15416232876', to: '+91'+userNo})
    .then(message => console.log(message.sid,'Message send.!'));

