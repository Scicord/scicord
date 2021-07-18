"use strict";

const BotClient = require('./BotClient');
const Client = new BotClient(require('../config/config.json'));
const rulesSecret = require('./utils/rulesSecret');
rulesSecret.generateSecret();
Client.connect();