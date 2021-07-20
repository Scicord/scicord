"use strict";
const Command = require('./command');
const Config = require('../../config/command/ihavereadtherules.json');
const rulesSecret = require('../utils/rulesSecret');

module.exports = class Verify extends Command
{
    botPermissionsToExecute = () => {
        return ['MANAGE_ROLES'];
    }

    userPermissionsToExecute = () => {
        return [];
    }

    /// True if the user can execute. Expects a GuildMember object.
    canUserExecute = (guildMember) => {
        return guildMember.roles.cache.every(role => !Config.noReauthRoles.includes(role.name));
    }

    verifyChannel = (guildChannel) => {
        if(guildChannel.type !== 'text')
            return false;
        
        if(!guildChannel.name.startsWith(Config.authCategory))    
            return false;
        
        if(!guildChannel.parent || guildChannel.parent.name !== Config.authCategory)
            return false;
        
        return true;
    }

    execute = (botClient, message) => {
        const args = this.args(botClient, message);
        if(!this.verifyChannel(message.channel))
            return;
    
        const secret = args[0];
        
        if(!rulesSecret.secretOk(secret))
        {
            message.channel.send("Incorrect or expired verification code, please read the rules and try again.");
            rulesSecret.greet(message.channel, message.member);
            return;
        }
        
        const roleToAdd = message.guild.roles.cache.find(role => Config.roleToAdd === role.name);
        message.member.roles.add(roleToAdd);
        message.channel.delete('User has authorized').then(console.log(`User ${message.member.id} authorized, deleting #${message.channel.name}`)).catch(console.error);
    }
}