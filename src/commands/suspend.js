"use strict";
const Command = require('./command');
const Config = require('../../config/command/quarantine.json')
const channelUtils = require('../utils/channelUtils');
const { MessageEmbed } = require('discord.js');
const TransientChannels = require('../db/transientchannels');

module.exports = class Suspend extends Command
{
    botPermissionsToExecute = () => {
        return ['MANAGE_ROLES', 'MANAGE_CHANNELS'];
    }

    userPermissionsToExecute = () => {
        return ['MANAGE_ROLES', 'MANAGE_CHANNELS'];
    }

    usage = (isError) => {
        return new MessageEmbed()
            .setTitle("Suspend")
            .setDescription(`Usage: \`>suspend [mention/id] <reason>\``)
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

        const toQuarantine = this.getUserFromId(args[0], guild);
        if(!toQuarantine) {
            message.channel.send({
                embed: this.usage(true)
            });
            return;
        }            
        
        const modRoles = guild.roles.cache.filter(role => role.permissions.has('MANAGE_ROLES'));
        if(toQuarantine.roles.cache.some(role => Config.protectedRoles.includes(role.name))) {
            message.channel.send({
                embed: new MessageEmbed().setTitle('Suspend').setFooter('An error has occurred').setDescription('The user has a protected role')
            });
            return;
        }

        if(toQuarantine.roles.cache.filter(role => Config.quarantineRole === role.name).first()) {
            message.channel.send({
                embed: new MessageEmbed().setTitle('Suspend').setFooter('An error has occurred').setDescription('The user is already suspended')
            })
            return;
        }

        const userRoles = toQuarantine.roles.cache.filter(role => !Config.rolesToRemove.includes(role.name));
        const suspendedRole = guild.roles.cache.filter(role => Config.quarantineRole === role.name).first();
        const qtReason = args.splice(1).join(' ');

        if(!suspendedRole) {
            console.error("No suspended role found!");
            botClient.auditLog({
                embed: new MessageEmbed()
                    .setTitle('Suspend')
                    .setDescription(`No role with name ${Config.quarantineRole} was found - unable to suspend!`)
                    .setFooter('Technical Error - Contact Bot Authors')
            });
            message.channel.send({
                embed: new MessageEmbed().setTitle('Suspend').setFooter('An error has occurred').setDescription('Something has gone wrong')
            })

            return;
        }

        botClient.punishmentLog().addQuarantine(toQuarantine.id, message.author.id, qtReason);
        userRoles.set(suspendedRole.id, suspendedRole);
        toQuarantine.roles.set(userRoles).then(res => {
            channelUtils.generateIsolatedChannel(guild, channelUtils.generateUniqueChannelName(guild, Config.channelPrefix), toQuarantine, modRoles).then(channel => {
                channel.send(`You have been quarantined, <@${toQuarantine.id}>. Attempting to re-rank as Default or leave the server will result in an instant ban. A mod will join presently.` );
                const auditMessage = {
                    embed: new MessageEmbed()
                        .setTitle(`:warning: [Suspend] ${toQuarantine.user.username}#${toQuarantine.user.discriminator}`)
                        .setThumbnail(toQuarantine.user.displayAvatarURL())
                        .addField("User", toQuarantine, true)
                        .setColor("#d4b350")
                        .addField("Moderator", message.author, true)
                        .addField("Reason", qtReason, true)
                        .setTimestamp()
                };
                channel.send(auditMessage);
                botClient.auditLog(auditMessage);
                console.log("bog");
                botClient.transientChannels().addChannel(channel.id, toQuarantine.id, TransientChannels.TRANSIENT_CHANNEL_TYPE_QUARANTINE);
            }).catch(err => {
                console.error(err);
                message.channel.send({
                    embed: new MessageEmbed().setTitle('Suspend').setFooter('An error has occurred').setDescription('Error suspending user')
                })    
            });
        }).catch(err => {
            console.error(err);
            message.channel.send({
                embed: new MessageEmbed().setTitle('Suspend').setFooter('An error has occurred').setDescription('Error suspending user')
            })
        });            
    }
};