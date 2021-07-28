"use strict";

const log = require('../utils/logger')();
const startServer = require('../web/app');

module.exports = (client) => {
    log.info('Bot has started');
    startServer(client);
};