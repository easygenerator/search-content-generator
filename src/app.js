const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const routes = require('./routes');
const config = require('./config');

let app = express();

app.use(cors());
app.use('/', routes);

app.listen(config.app.port, config.app.ip);

module.exports.generate = serverless(app);
