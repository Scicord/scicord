"use strict";
const Command = require('./command');
const channelUtils = require('../utils/channelUtils');

module.exports = class Quarantine extends Command
{
    botPermissionsToExecute = () => {
        return ['MANAGE_ROLES', 'MANAGE_CHANNELS'];
    }

    userPermissionsToExecute = () => {
        return ['MANAGE_ROLES', 'MANAGE_CHANNELS'];
    }

    execute = (botClient, message) => {
        const toQuarantine = message.mentions.users.first();
        if(!toQuarantine)
            return;
        
        const guild = message.guild;      
        const modRoles = guild.roles.cache.filter(role => role.permissions.has('MANAGE_ROLES'));
    
        channelUtils.generateIsolatedChannel(guild, channelUtils.generateUniqueChannelName(guild, 'quarantine'), toQuarantine, modRoles).then(channel => {
            channel.send(`You have been quarantined, <@${toQuarantine.id}>. Attempting to re-rank as Default or leave the server will result in an instant ban. A mod will join presently.` );
        }).catch(console.error);
    }
};