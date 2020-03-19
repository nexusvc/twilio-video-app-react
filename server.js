const fs = require('fs');
const express = require('express');
const app = express();

const credentials = {
    key: fs.readFileSync(__dirname + '/leadtrust.io.key', 'utf8'),
    cert: fs.readFileSync(__dirname + '/leadtrust.io.crt', 'utf8'),
    ca: fs.readFileSync(__dirname + '/leadtrust.io.bundle.crt')
};

const path = require('path');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/token', (req, res) => {
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

// app.listen(8081, () => console.log('token server running on 8081'));

const server = require('https').Server(credentials, app);

server.listen(8081);
