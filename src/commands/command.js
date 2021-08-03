"use strict";

module.exports = class Command 
{
    /// The commandConfig
    commandConfig = () => {
        return null;
    }

    /// True if the bot can execute. Expects a Guild object.
    canIExecute = (guild) => {
        return this.commandConfig().getBotPermissionsToExecute().every(perm => guild.me.hasPermission(perm));
    }

    /// True if the user can execute. Expects a GuildMember object.
    canUserExecute = (guildMember) => {
        const f = this.commandConfig().getUserPermissionFn(guildMember);
        return f();
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