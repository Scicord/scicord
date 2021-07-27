"use strict";
const log = require('./utils/logger')();

const main = () => {
    log.info("Bot is starting");
    const BotClient = require('./discord/BotClient');
    const Client = new BotClient(require('../config/config.json'));
    const rulesSecret = require('./utils/rulesSecret');
    rulesSecret.generateSecret();
    Client.connect();
}

main();