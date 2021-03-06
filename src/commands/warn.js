const Command = require('./command');
const Config = require('../../config/command/warn.json')
const channelUtils = require('../utils/channelUtils');
const { MessageEmbed } = require('discord.js');
const log = require('../utils/logger')();
const userUtils = require('../utils/userUtils');
const CommandConfig = require('../config/commandConfig');

module.exports = class Warn extends Command
{
    constructor()
    {
        super();
        this.config = new CommandConfig(Config);
    }

    commandConfig = () => {
        return this.config;
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

        const {protectedRoles} = this.commandConfig().getConfig();
        const userIsProtected = this.commandConfig().permissionFn(protectedRoles, toWarn);

        if(userIsProtected()) {
            log.warn(`${userUtils.userLabel(message.member)} Attempting to warn ${userUtils.userLabel(toWarn)} but target has protected role`);
            message.channel.send({
                embed: new MessageEmbed().setTitle('Warn').setFooter('An error has occurred').setDescription('The user has a protected role')
            });
            return;
        }

        const warnReason = args.splice(1).join(" ");
        botClient.punishmentLog().addWarn(toWarn.id, message.author.id, warnReason).catch(console.error);

        const warningEmbed = new MessageEmbed()
            .setTitle(`:warning: [Warn] ${userUtils.userLabel(toWarn)}`)
            .setColor("#d4b350")
            .setDescription(`Reason: ${warnReason}`);
        
        message.channel.send({
            content: `<@${toWarn.user.id}>`,
            embed: warningEmbed
        });

        log.info(`Successfully warned ${userUtils.userLabel(toWarn)}`);
        botClient.auditLog({
            embed: new MessageEmbed()
                .setTitle(`:warning: [Warn] ${userUtils.userLabel(toWarn)}`)
                .setThumbnail(toWarn.user.displayAvatarURL())
                .addField("User", toWarn, true)
                .setColor("#d4b350")
                .addField("Moderator", message.author, true)
                .addField("Reason", warnReason, true)
                .setTimestamp()
        })
    }
}