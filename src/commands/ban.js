"use strict";
const Command = require('./command');
const { MessageEmbed } = require('discord.js');
const userUtils = require('../utils/userUtils');
const CommandConfig = require('../config/commandConfig');
const TransientChannels = require('../db/transientchannels');
const log = require('../utils/logger')();
const ServerConfig = require('../../config/server.json');

module.exports = class Ban extends Command {
    constructor()
    {
        super();
        this.config = new CommandConfig(require('../../config/command/ban.json'));
    }

    commandConfig = () => {
        return this.config;
    }

    usage = (isError) => {
        return new MessageEmbed()
            .setTitle("Ban")
            .setDescription(`Usage: \`>ban [mention/id] [reason]\``)
            .setFooter(isError ? "An error has occurred" : "Usage instructions");
    }

    execute = (botClient, message) => {
        const args = this.args(botClient, message);
        const guild = message.guild;

        if(!args || args.length < 2) {
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

        const toBan = this.getUserFromId(args[0], guild);
        const banReason = args.splice(1).join(' ');

        const {protectedRoles} = this.commandConfig().getConfig();
        const userIsProtected = this.commandConfig().permissionFn(protectedRoles, toBan);
        if(userIsProtected()) {
            log.warn(`${userUtils.userLabel(message.member)} Attempting to ban ${userUtils.userLabel(toBan)} but target has protected role`);
            message.channel.send({
                embed: new MessageEmbed().setTitle('Ban')
                    .setFooter('An error has occurred')
                    .setDescription('The user has a protected role')
            });
            return;
        }

        const transientChannels = botClient.transientChannels()
        toBan.ban({ reason: banReason }).then((member) => {
            // Destroy all quarantine channels for this user
            transientChannels.channelsForUser(toBan.id, TransientChannels.TRANSIENT_CHANNEL_TYPE_QUARANTINE).then(channels => {
                channels.forEach(channel => transientChannels.destroyChannel(channel.id));
            });

            botClient.punishmentLog().addBan(toBan.id, message.author.id, banReason);

            message.channel.send({
                embed: new MessageEmbed().setTitle('Ban')
                    .setTitle(`:hammer: [Ban] ${userUtils.userLabel(toBan)}`)
                    .setDescription(`Reason: ${banReason}`)
            });

            log.info(`Successfully banned ${userUtils.userLabel(toBan)}`);
            botClient.auditLog({
                embed: new MessageEmbed()
                    .setTitle(`:hammer: [Ban] ${userUtils.userLabel(toBan)}`)
                    .setThumbnail(toBan.user.displayAvatarURL())
                    .addField("User", toBan, true)
                    .setColor("#d4b350")
                    .addField("Moderator", message.author, true)
                    .addField("Reason", banReason, true)
                    .setTimestamp()
            });
        }).catch(err => {
            log.error(err);
            message.channel.send({
                embed: new MessageEmbed().setTitle('Ban').setFooter('An error has occurred').setDescription('Error banning user')
            })
        });
    }
};