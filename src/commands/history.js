"use strict";
const Command = require('./command');
const Config = require('../../config/command/quarantine.json')
const userUtils = require('../utils/userUtils');
const { MessageEmbed } = require('discord.js');
const CommandConfig = require('../config/commandConfig');

module.exports = class History extends Command {
    constructor() {
        super();
        this.config = new CommandConfig(Config);
    }

    commandConfig = () => {
        return this.config;
    }

    usage = (isError) => {
        return new MessageEmbed()
            .setTitle("History")
            .setDescription(`Usage: \`>history [mention/id]\``)
            .setFooter(isError ? "An error has occurred" : "Usage instructions");
    }

    execute = (botClient, message) => {
        const args = this.args(botClient, message);
        const guild = message.guild;

        if(!args || args.length < 1) {
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

        const toSeeHistory = this.getUserFromId(args[0], guild);
        const punishments = botClient.punishmentLog().punishmentsForUser(toSeeHistory.id).then(punishments => {

            const punishmentsCount = punishments.length
            var description = `The last ${punishmentsCount} punishments for <@${toSeeHistory.id}>`

            // A special message for the lonely ones out there
            if (punishmentsCount === 1) {
                description = `The last punishment for <@${toSeeHistory.id}>`
            }

            punishments.forEach(function (punishment, i) {
                let type = "Warn"
                if (punishment.type === 'quarantine') {
                    type = "Quarantine"
                }

                if (punishment.type === 'ban') {
                    type = "Ban"
                }

                var reason = punishment.reason
                if (!reason || reason === "") {
                    reason = "No reason specified."
                }

                description += `\n\n**${i + 1}. ${type}**\n`
                description += `For \`${reason}\`\n`
                description += `By <@${punishment.issuer}>`
            })

            const punishmentsMessageEmbed = new MessageEmbed()
                .setTitle(`:warning: Punishment History ${userUtils.userLabel(toSeeHistory)}`)
                .setColor("#d4b350")
                .setDescription(description);

            message.channel.send({
                embed: punishmentsMessageEmbed
            });
        });


    }
};