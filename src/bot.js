"use strict";

const BotClient = require('./BotClient');
const Client = new BotClient(require('../config/config.json'));
Client.connect();