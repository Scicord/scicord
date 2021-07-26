const BotClient = '../../discord/BotClient';

module.exports = class BotClientMock
{
    constructor(config) { }

    init = () => {}

    connect = () => {}

    auditLog = (message) => {}

    transientChannels = () => {}

    punishmentLog = () => {}
};