"use strict";
const Command = require('./command');
const Config = require('../../config/command/quarantine.json')
const CommandConfig = require('../config/commandConfig');
const { MessageEmbed } = require('discord.js')
const TransientChannels = require('../db/transientchannels');

module.exports = class Unsuspend extends Command
{
    constructor()
    {
        super();
        this.config = new CommandConfig(Config);
    }

    commandConfig = () => {
        return this.config;
    }

    usage = (message) => {
        return new MessageEmbed()
            .setTitle("Unsuspend")
            .setDescription(`Usage: \`>unsuspend [mention/id]\``)
            .setFooter(message || "");
    }

    error = (message) => {
        return new MessageEmbed()
            .setTitle("Unsuspend")
            .setDescription(message || "")
            .setFooter("An error has occurred")
    }

    execute = (botClient, message) => {
        const args = this.args(botClient, message);
        const guild = message.guild;
        if(!args || args.length === 0) {
            message.channel.send({
                embed: this.usage("There was no user specified!")
            });
            return;
        }

        if(args[0] === "help") {
            message.channel.send({
                embed: this.usage("Usage instructions")
            });
            return;
        }

        const {protectedRoles, quarantineRole, defaultRole, channelPrefix} = this.commandConfig().getConfig();

        // Check for suspended role to exist
        const suspendedRole = guild.roles.cache.filter(role => quarantineRole === role.name).first();
        if(!suspendedRole) {
            console.error("No suspended role found!");
            botClient.auditLog({
                embed: new MessageEmbed()
                    .setTitle('Suspend')
                    .setDescription(`No role with name ${quarantineRole} was found - unable to suspend!`)
                    .setFooter('Technical Error - Contact Bot Authors')
            });
            message.channel.send({
                embed: this.error('Something has gone wrong!')
            })

            return;
        }

        // Check for default role to exist
        const defaultRoleAdd = guild.roles.cache.filter(role => role.name === defaultRole).first()
        if(!defaultRoleAdd) {
            console.error("No default role found!");
            botClient.auditLog({
                embed: new MessageEmbed()
                    .setTitle('Suspend')
                    .setDescription(`No role with name ${defaultRole} was found - unable to suspend!`)
                    .setFooter('Technical Error - Contact Bot Authors')
            });
            message.channel.send({
                embed: this.error('Something has gone wrong!')
            })

            return;
        }

        // Unsuspend user
        const toUnquarantine = this.getUserFromId(args[0], guild);
        if(!toUnquarantine) {
            message.channel.send({
                embed: this.error("User could not be found!")
            });
            return;
        }

        // Check to see the user's role to see if they are suspended
        const userSuspended = toUnquarantine.roles.cache.filter(role => quarantineRole === role.name).first()
        if (!userSuspended) {
            message.channel.send({
                embed: this.error('User is not suspended!')
            })

            return;
        }

        // Get user roles
        let userRoles = toUnquarantine.roles.cache

        // Remove Suspended role
        userRoles = userRoles.filter(role => quarantineRole !== role.name)

        // Add default role
        userRoles.set(defaultRoleAdd.id, defaultRoleAdd)

        botClient.temporaryRoles().getTemporaryRoles(toUnquarantine.id).then(temporaryRoles => {
                let activeRoles = temporaryRoles.flatMap(temporaryRole => {
                    return guild.roles.cache.find(role => role.name === temporaryRole.role)
                });

                activeRoles.forEach(activeRole => {
                    if (activeRole) {
                        userRoles.set(activeRole.id, activeRole)
                    }
                });

                // Remove all temporary roles
                botClient.temporaryRoles().removeTemporaryRoles(toUnquarantine.id)

                // After removing roles, we must delete all quarantine transient channels associated with this user.
                let transientChannels = botClient.transientChannels()
                toUnquarantine.roles.set(userRoles).then(res => {
                    transientChannels.activeChannelsForUser(toUnquarantine.id, TransientChannels.TRANSIENT_CHANNEL_TYPE_QUARANTINE).then(channels => {
                            // Find all active channels
                            let activeChannels = channels.flatMap(channel => {
                                transientChannels.destroyChannel(channel.id);
                                return guild.channels.cache.get(channel.id);
                            });

                            // Delete all channels
                            activeChannels.forEach(activeChannel => { if (activeChannel) activeChannel.delete() });
                        }
                    );
                })
            }
        );
    }
}