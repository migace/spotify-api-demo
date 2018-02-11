const express = require('express')
const cookieParser = require('cookie-parser')
const spotify = require('./routes/spotify')
const CONSTANTS = require('./constants');

const app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser())
   .use('/', spotify);

console.log(`Listening on ${CONSTANTS.LOCALHOST}:${CONSTANTS.PORT}`);
app.listen(CONSTANTS.PORT);
