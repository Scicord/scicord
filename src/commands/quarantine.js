"use strict";
const Command = require('./command');

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
        const everyoneRole = guild.roles.everyone;          
        const maxQtChannel = guild.channels.cache.filter(channel => channel.name.startsWith('quarantine-'))
            .map(channel => parseInt(channel.name.split('-')[1], 10)).sort().pop() || 0;
                

        const modRoleOverrides = guild.roles.cache.filter(role => role.permissions.has('MANAGE_ROLES')).map(role => ({
            type: 'role',
            id: role.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
        }));        
    
        // Allow myself.
        modRoleOverrides.push({
            type: 'member',
            id: message.guild.me.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
        });
    
        guild.channels.create(`quarantine-${maxQtChannel + 1}`, {
            reason: `Quarantine for user ${toQuarantine.displayName} requested by ${message.member.displayName}`,
            type: 'text',
            permissionOverwrites: [{
                type: 'role',
                deny: 'VIEW_CHANNEL',
                id: everyoneRole.id
            }, {
                type: 'member',
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                id: toQuarantine.id
            }, ...modRoleOverrides]
        }).then(channel => {
            channel.send(`You have been quarantined, <@${toQuarantine.id}>. Attempting to re-rank as Default or leave the server will result in an instant ban. A mod will join presently.` );
        }).catch(console.error);
    }
};