"use strict";
const Command = require('./command');
const Config = require('../../config/command/quarantine.json')
const { MessageEmbed } = require('discord.js')
const db = require('../db/db');

module.exports = class Unsuspend extends Command
{
    botPermissionsToExecute = () => {
        return ['MANAGE_ROLES', 'MANAGE_CHANNELS'];
    }

    userPermissionsToExecute = () => {
        return ['MANAGE_ROLES', 'MANAGE_CHANNELS'];
    }

    usage = () => {
        return new MessageEmbed()
            .setTitle(this.commandName)
            .setDescription(`Usage: \`>unsuspend [mention/id] <reason>\``)
            .setFooter("Usage instructions");
    }

    success = () => {

    }

    error = (message) => {
        return new MessageEmbed()
            .setTitle(this.commandName)
            .setDescription(message || "")
            .setFooter("An error has occurred")
    }

    execute = (botClient, message) => {
        const args = this.args(botClient, message);
        const guild = message.guild;
        if(!args || args.length === 0) {
            message.channel.send({
                embed: this.error()
            });
            return;
        }

        if(args[0] === "help") {
            message.channel.send({
                embed: this.usage()
            });
            return;
        }

        const toUnquarantine = this.getUserFromId(args[0], guild);
        if(!toUnquarantine) {
            message.channel.send({
                embed: this.error("User could not be found!")
            });
            return;
        }

        const modRoles = guild.roles.cache.filter(role => role.permissions.has('MANAGE_ROLES'));
        if(toUnquarantine.roles.cache.some(role => Config.protectedRoles.includes(role.name))) {
            message.channel.send({
                embed: this.error("The user has a protected role!")
            });
        }

        // Check for these two roles
        const suspendedRole = guild.roles.cache.filter(role => Config.quarantineRole === role.name).first();
        if(!suspendedRole) {
            console.error("No suspended role found!");
            botClient.auditLog({
                embed: new MessageEmbed()
                    .setTitle('Suspend')
                    .setDescription(`No role with name ${Config.quarantineRole} was found - unable to suspend!`)
                    .setFooter('Technical Error - Contact Bot Authors')
            });
            message.channel.send({
                embed: this.error('Something has gone wrong')
            })

            return;
        }

        const defaultRole = guild.roles.cache.filter(role => !Config.rolesToRemove.includes(role.name)).first()
        if(!defaultRole) {
            console.error("No default role found!");
            botClient.auditLog({
                embed: new MessageEmbed()
                    .setTitle('Suspend')
                    .setDescription(`No role with name ${Config.rolesToRemove} was found - unable to suspend!`)
                    .setFooter('Technical Error - Contact Bot Authors')
            });
            message.channel.send({
                embed: this.error('Something has gone wrong')
            })

            return;
        }

        const userSuspended = toUnquarantine.roles.cache.filter(role => Config.quarantineRole === role.name).first()
        if (!userSuspended) {
            message.channel.send({
                embed: this.error('User is not suspended!')
            })

            return;
        }

        // Remove suspension
        var userRoles = toUnquarantine.roles.cache.filter(role => !Config.quarantineRole === role.name)

        // Add default role
        userRoles.set(defaultRole.id, defaultRole);

        // After removing roles, we must delete all quarantine transient channels associated with this user.
        toUnquarantine.roles.set(userRoles).then(res => {
            botClient.transientChannels().quarantineChannelsforUser(toUnquarantine.id).then(channels => {
                console.log(channels);
            });
        })
    }
}