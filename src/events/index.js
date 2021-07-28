"use strict";

module.exports = {
    "ready": require('./ready'),
    "message": require('./message'),
    "guildMemberAdd": require('./welcome'),
    "guildMemberRemove": require('./revokeOtp').onLeave,
    "guildBanAdd": require('./revokeOtp').onBan
};