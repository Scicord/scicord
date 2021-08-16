"use strict";
const Command = require('./command');
const { MessageEmbed } = require('discord.js');
const userUtils = require('../utils/userUtils');
const CommandConfig = require('../config/commandConfig');
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

        toBan.ban({ reason: banReason }).then((member) => {
            botClient.punishmentLog().addQuarantine(toBan.id, message.author.id, banReason);

            message.channel.send({
                embed: new MessageEmbed().setTitle('Ban')
                    .setTitle(`:hammer: [Ban] ${userUtils.userLabel(toBan)}`)
                    .setDescription(`Reason: ${banReason}`)
            });
        });
    }
};