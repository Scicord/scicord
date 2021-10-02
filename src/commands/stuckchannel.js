"use strict";
const Command = require('./command');
const Config = require('../../config/command/quarantine.json')
const { MessageEmbed } = require('discord.js');
const CommandConfig = require('../config/commandConfig');
const log = require('../utils/logger')();

module.exports = class Stuckchannel extends Command
{
    constructor()
    {
        super();
        this.config = new CommandConfig(Config);
    }

    commandConfig = () => {
        return this.config;
    }

    usage = () => {
        return new MessageEmbed()
            .setTitle("Stuck Channel")
            .setDescription(`Usage: \`>stuckchannel\``)
            .setFooter("Removes any channel with quarantine prefix");
    }

    execute = (botClient, message) => {
        const args = this.args(botClient, message);
        const guild = message.guild;

        if(args[0] === "help") {
            message.channel.send({
                embed: this.usage()
            });
            return;
        }

        const {channelPrefix} = this.commandConfig().getConfig();
        const transientChannels = botClient.transientChannels()

        const stuckChannels = guild.channels.cache.array().filter(channel => channel.name.includes(channelPrefix));
        stuckChannels.forEach(channel => {
            transientChannels.inactiveChannel(channel.id).then(inactiveChannels => {
                // We only destroy channels that do not have a ban/suspended user in there
                if (inactiveChannels.length > 0) {
                    log.info(`Deleting #${channel.name} (${channel.id})`);
                    channel.delete();
                }
            });
        });

        log.info(`Successfully removed any stuck channels!`);
    }
};