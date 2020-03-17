"use strict";
const Command = require('./command');

module.exports = class Quarantine extends Command
{
    botPermissionsToExecute = () => {
        return ['MANAGE_ROLES', 'MANAGE_CHANNELS'];
    }

    userPermissionsToExecute = () => {
        return ['BAN_MEMBERS'];
    }

    execute = (botClient, message) => {
        const toQuarantine = message.mentions.users.first();
        if(!toQuarantine)
            return;
        
        const maxQtChannel = message.guild.channels.cache.filter(channel => channel.name.startsWith('quarantine-'))
            .map(channel => parseInt(channel.name.split('-')[1], 10)).sort().pop() || 0;
    
        const modRoleOverrides = message.guild.roles.cache.filter(role => role.permissions.has('BAN_MEMBERS')).map(role => ({
            type: 'role',
            id: role.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
        }));        
    
        // Allow myself.
        modRoleOverrides.push({
            type: 'member',
            id: message.guild.me.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'MANAGE_MESSAGES']
        });
    
        message.guild.channels.create(`quarantine-${maxQtChannel + 1}`, {
            reason: `Quarantine for user ${toQuarantine.displayName} requested by ${message.member.displayName}`,
            permissionOverwrites: [{
                type: 'role',
                deny: 'VIEW_CHANNEL',
                id: message.guild.id,            
            }, {
                type: 'member',
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                id: toQuarantine.id
            }, ...modRoleOverrides]
        }).then(channel => {
            channel.send(`You have been quarantined, <@${toQuarantine.id}>. Attempting to re-rank as Default or leave the server will result in an instant ban. A mod will join presently.` );
        }); 
    }
};