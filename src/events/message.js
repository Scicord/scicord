"use strict";

const commands = require('../commands');
const log = require('../utils/logger')();
const commandInstances = {};
Object.entries(commands).forEach(([key, clz]) => {
    commandInstances[key] = new clz();
});

module.exports = (botClient, message) => {
    if (message.author.bot ||
        message.content.indexOf(botClient.prefix) !== 0) 
    {
        // This isn't a bad place to log all messages if we want them stored in some transiet store.
        return;
    }
    
    // Only channel messages
    if(!message.guild) {
        log.warn('Ignoring non-guild message');
        return;
    }

    const split = message.content.substr(1).trim().split(/ +/g);
    const command = commandInstances[split[0]];

    log.info(`Received request to run ${split[0]}`)
    if(!command)
        return;

    // Permission check!
    if(!command.canIExecute(message.guild)) {
        log.warn(`Insufficient privileges to execute ${split[0]}`)        
        return;
    }

    if(!command.canUserExecute(message.member)) {
        log.warn(`User ${message.member.displayName} (id: ${message.member.id}) tried to ${split[0]}, but does not have permission`);
        return;
    }

    command.execute(botClient, message);
};