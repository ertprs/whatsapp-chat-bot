const twilio = require('twilio');
const auth_token = 'ce681d52a248fcd5d37bb6dfa1bb2b30';
const accnt_sid = 'AC34364b77470b6dc9dfc89002aa7e6010';
const client = require('twilio')(accnt_sid, auth_token);

const sendMessage = (userPhoneNum, buzzPhoneNum, body, media) => {
  client.messages.create({
    from: buzzPhoneNum,
    body: body,
    mediaUrl: media,
    to: userPhoneNum,
  });
};
module.exports = sendMessage;
