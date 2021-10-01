"use strict";
const Command = require('./command');
const Config = require('../../config/command/report.json')
const userUtils = require('../utils/userUtils');
const { MessageEmbed } = require('discord.js');
const CommandConfig = require('../config/commandConfig');

module.exports = class Report extends Command {
    constructor() {
        super();
        this.config = new CommandConfig(Config);
    }

    commandConfig = () => {
        return this.config;
    }

    usage = (isError) => {
        return new MessageEmbed()
            .setTitle("Report")
            .setDescription(`Usage: \`>report [mention/id] [reason]\``)
            .setFooter(isError ? "An error has occurred" : "Usage instructions");
    }

    error = (message) => {
        return new MessageEmbed()
            .setTitle("Report")
            .setDescription(message || "")
            .setFooter("An error has occurred")
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

        const {channel, reportMessage} = this.commandConfig().getConfig();

        const reportReason = args.splice(1).join(' ');
        const toReport = this.getUserFromId(args[0], guild);
        const reportChannel = guild.channels.cache.find(c => c.name === channel);

        // User is attempting to report themselves
        if (message.author.id === toReport.id) {
            message.channel.send({
                embed: this.error("You can't report yourself.")
            });
            return;
        }

        // Notify channel that we have received their report
        message.channel.send(reportMessage);

        // If there is no report channel configured, just return safely
        if(!reportChannel)
            return;

        const messageReported = `:mag_right: **Reported** ${userUtils.userLabel(toReport)} (ID ${toReport.id})`
        const messageReason = `:page_facing_up: **Reason:** ${reportReason} ([Logs](${message.url}))`
        const messageChannel = `**Channel:** <#${message.channel.id}>`

        reportChannel.send({
            embed: new MessageEmbed()
                .setAuthor(`${message.author.username}#${message.author.discriminator} (ID ${message.author.id})`, message.author.displayAvatarURL())
                .setThumbnail(toReport.user.displayAvatarURL())
                .setColor("#e977e4")
                .setDescription(`${messageReported}\n${messageReason}\n${messageChannel}`)
        });
    }
};