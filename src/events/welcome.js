"use strict";
const rulesSecret = require('../utils/rulesSecret');
const channelUtils = require('../utils/channelUtils');
const Config = require('../../config/command/ihavereadtherules.json');

const onAdd = (botClient, guildMember) => {
    const guild = guildMember.guild;
    const modRoles = guild.roles.cache.filter(role => role.permissions.has('MANAGE_ROLES'));
    channelUtils.generateIsolatedChannel(guild, channelUtils.generateUniqueChannelName(guild, Config.authCategory), guildMember, modRoles).then(channel => {
        const category = guild.channels.cache.find(c => c.name === Config.authCategory && c.type === 'category');
        if(category)
            channel.setParent(category);    
        rulesSecret.greet(channel, guildMember);                        
    }).catch(console.error);
};

module.exports = onAdd;