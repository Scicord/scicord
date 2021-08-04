const BotClient = require('../../discord/BotClient');

module.exports = class BotClientMock extends BotClient
{
    constructor(config) {
        super(config, null, null);
    }

    init = () => {}

    connect = () => {}

    auditLog = (message) => {}

    transientChannels = () => {}

    punishmentLog = () => {}
};