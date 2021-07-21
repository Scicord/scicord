"use strict";

const main = () => {
    const BotClient = require('./discord/BotClient');
    const Client = new BotClient(require('../config/config.json'));
    const rulesSecret = require('./utils/rulesSecret');
    rulesSecret.generateSecret();
    Client.connect();
}

main();