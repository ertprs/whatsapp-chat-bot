const twilio = require('twilio');
const twilio = require('twilio');

const auth_token = '';
const accnt_sid = '';
const client = twilio(accnt_sid, auth_token);

client.messages.create({
    'from': 'whatsapp:+1',
    'body': "Kindly tell us the patient's full name? Ex. Ashish Yadav",
    'to': ''
})