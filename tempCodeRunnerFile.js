const accountSid = 'AC3d2a984af8fb85d9e453ebb54477de6c';
const authToken = 'd6dc7d11530e4f99be7c2741f6f8144b';
const client = require('twilio')(accountSid, authToken);

const sendWhatsAppMessage = async (to, from, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: from,
      to: to,
    });
    console.log(`Message sent. SID: ${message.sid}`);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Usage example:
const to = 'whatsapp:+919637957346'; // Include the country code without '+' or '00'
const from = 'whatsapp:+15416232876'; // Twilio phone number associated with your account
const body = 'Hello, this is a WhatsApp message sent with Node.js!';

sendWhatsAppMessage(to, from, body);
