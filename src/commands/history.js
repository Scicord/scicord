"use strict";
const Command = require('./command');
const Config = require('../../config/command/quarantine.json')
const channelUtils = require('../utils/channelUtils');
const userUtils = require('../utils/userUtils');
const { MessageEmbed } = require('discord.js');
const TransientChannels = require('../db/transientchannels');
const CommandConfig = require('../config/commandConfig');
const log = require('../utils/logger')();


module.exports = class Suspend extends Command {
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
            .setDescription(`Usage: \`>history [mention/id]`)
            .setFooter(isError ? "An error has occurred" : "Usage instructions");
    }

    execute = (botClient, message) => {
        const args = this.args(botClient, message);

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

        const user = this.getUserFromId(args[0], guild);
        const punishments = botClient.punishmentLog().punishmentsForUser(user.id)

        // Print out by sending message using builder here and punishments above
    }
};