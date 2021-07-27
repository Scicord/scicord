const Command = require('./command');
const Config = require('../../config/command/warn.json')
const channelUtils = require('../utils/channelUtils');
const { MessageEmbed } = require('discord.js');
const log = require('../utils/logger')();

module.exports = class Warn extends Command
{
    botPermissionsToExecute = () => {
        return ['MANAGE_ROLES', 'MANAGE_CHANNELS'];
    }

    userPermissionsToExecute = () => {
        return ['MANAGE_ROLES', 'MANAGE_CHANNELS'];
    }

    usage = (isError) => {
        return new MessageEmbed()
            .setTitle("Warn")
            .setDescription(`Usage: \`>warn [mention/id] [reason]\``)
            .setFooter(isError ? "An error has occurred" : "Usage instructions");
    }

    execute = (botClient, message) => {
        const args = this.args(botClient, message);
        const guild = message.guild;
        if(!args || args.length === 0) {
            message.channel.send({
                embed: this.usage(true)
            });
            return;
        }

        if(args[0] === "help") {
            message.channel.send({
                embed: this.usage(false)
            });
            return;
        }

        const toWarn = this.getUserFromId(args[0], guild);
        if(!toWarn) {
            message.channel.send({
                embed: this.usage(true)
            });
            return;
        }            

        if(toWarn.roles.cache.some(role => Config.protectedRoles.includes(role.name))) {
            log.warn(`${message.author.user.username}#${message.author.user.discriminator}` +
            `Attempting to warn ${toWarn.user.username}#${toWarn.user.discriminator} but target has protected role`);
            message.channel.send({
                embed: new MessageEmbed().setTitle('Warn').setFooter('An error has occurred').setDescription('The user has a protected role')
            });
            return;
        }

        const warnReason = args.splice(1).join(" ");
        botClient.punishmentLog().addWarn(toWarn.id, message.author.id, warnReason).catch(console.error);

        const warningEmbed = new MessageEmbed()
            .setTitle(`:warning: [Warn] ${toWarn.user.username}#${toWarn.user.discriminator}`)
            .setColor("#d4b350")
            .setDescription(`Reason: ${warnReason}`);
        
        message.channel.send({
            content: `<@${toWarn.user.id}>`,
            embed: warningEmbed
        });

        log.info(`Successfully warned ${toWarn.user.username}#${toWarn.user.discriminator}`);
        botClient.auditLog({
            embed: new MessageEmbed()
                .setTitle(`:warning: [Warn] ${toWarn.user.username}#${toWarn.user.discriminator}`)
                .setThumbnail(toWarn.user.displayAvatarURL())
                .addField("User", toWarn, true)
                .setColor("#d4b350")
                .addField("Moderator", message.author, true)
                .addField("Reason", warnReason, true)
                .setTimestamp()
        })
    }
}