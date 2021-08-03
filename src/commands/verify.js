"use strict";
const Command = require('./command');
const Config = require('../../config/command/ihavereadtherules.json');
const rulesSecret = require('../utils/rulesSecret');
const userUtils = require('../utils/userUtils');
const CommandConfig = require('../config/commandConfig');
const log = require('../utils/logger')();

module.exports = class Verify extends Command
{
    constructor()
    {
        super();
        this.config = new CommandConfig(Config);
    }

    commandConfig = () => {
        return this.config;
    }

    verifyChannel = (guildChannel) => {
        const { authCategory } = this.commandConfig().getConfig();

        if(guildChannel.type !== 'text')
            return false;
        
        if(!guildChannel.name.startsWith(authCategory))    
            return false;
        
        if(!guildChannel.parent || guildChannel.parent.name !== authCategory)
            return false;
        
        return true;
    }

    execute = (botClient, message) => {
        const args = this.args(botClient, message);
        const { roleToAdd } = this.commandConfig().getConfig();
        if(!this.verifyChannel(message.channel))
        {
            log.warn(`User ${userUtils.userLabel(message.member)} attempting to verify in non-welcome channel`);
            return;
        }
    
        const secret = args[0];
        
        if(!rulesSecret.secretOk(secret))
        {
            message.channel.send("Incorrect or expired verification code, please read the rules and try again.");
            log.info(`User ${userUtils.userLabel(message.member)} failed to verify!`);
            rulesSecret.greet(message.channel, message.member);
            return;
        }
                
        const role = message.guild.roles.cache.find(role => roleToAdd === role.name);
        message.member.roles.add(role);
        log.info(`User ${userUtils.userLabel(message.author)} has verified`);
        message.channel.delete('User has authorized').then(console.log(`User ${message.member.id} authorized, deleting #${message.channel.name}`)).catch(console.error);
    }
}