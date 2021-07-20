"use strict";

module.exports = class Command 
{
    /// The array of permissions the bot needs to execute. Permissions are assumed to be ANDed together.
    botPermissionsToExecute = () => {
        return [];
    }

    /// The array of permissions the user needs to execute. Permissions are assumed to be ANDed together.
    userPermissionsToExecute = () => {
        return [];
    }

    /// True if the bot can execute. Expects a Guild object.
    canIExecute = (guild) => {
        return this.botPermissionsToExecute().every(perm => guild.me.hasPermission(perm));
    }

    /// True if the user can execute. Expects a GuildMember object.
    canUserExecute = (guildMember) => {
        return this.userPermissionsToExecute().every(perm => guildMember.hasPermission(perm));
    }

    /// THE BUSINESS.
    execute = (botClient, message) => {
        return;
    }

    /// Given the message, split out the args.
    args = (botClient, message) => {
        let args = message.content.slice(botClient.prefix.length).trim().split(/ +/);
        args.shift();
        return args;
    }
    
    /// Given one of the args as a possible uid, return the user from the guild
    getUserFromId = (userId, guild) => {
        const REPLACE_MENTION_REGEX = /[<>!@]/g;
        const targetDiscordUserId = userId.replace(REPLACE_MENTION_REGEX, "");
        if(!targetDiscordUserId || targetDiscordUserId.length === 0)
            return null;
        return guild.member(targetDiscordUserId);            
    }

}