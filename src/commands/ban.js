"use strict";
const Command = require('./command');
const { MessageEmbed } = require('discord.js');
const CommandConfig = require('../config/commandConfig');
const serverConfig = require('../../config/server.json');

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

        toBan.ban({ reason: banReason }).then((member) => {
            toBan.send(`You have been banned from ${serverConfig.name} for \`${banReason}\`.`)
            botClient.punishmentLog().addQuarantine(toBan.id, message.author.id, banReason);
        });
    }
};