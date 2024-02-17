const log = require('../utils/logger')();
const userUtils = require('../utils/userUtils');
const QuarantineConfig = require('../../config/command/quarantine.json')
const { MessageEmbed } = require('discord.js');
const TransientChannels = require('../db/transientchannels');

const onRemove = (botClient, guildMember) => {
    log.warn(`${userUtils.userLabel(guildMember)} is leaving guild!`)
    const auth = botClient.authTable();
    auth.revokeTokenForGuildMember(guildMember.guild.id, guildMember.id).catch(err => {
        log.error(err);
        log.fatal('Unable to revoke OTPs for user - EXITING!');
        process.exit(1);
    });

    // Ban user for leaving while Suspended
    if(guildMember.roles.cache.filter(role => QuarantineConfig.quarantineRole === role.name).first()) {
        log.info(`${userUtils.userLabel(guildMember)} is attempting to leave while suspended! Banning user.`)

        const banReason = "Leaving while suspended";
        guildMember.ban ({ reason: banReason }).then((member) => {
            // Remove all transient channels for this user
            const transientChannels = botClient.transientChannels();
            transientChannels.channelsForUser(guildMember.id, TransientChannels.TRANSIENT_CHANNEL_TYPE_QUARANTINE).then(channels => {
                channels.forEach(channel => transientChannels.destroyChannel(channel.id));
            });

            // Add to punishment log
            botClient.punishmentLog().addBan(guildMember.id, guildMember.id, banReason);

            // Send to audit log
            botClient.auditLog({
                embed: new MessageEmbed()
                    .setTitle(`:hammer: [Ban] ${userUtils.userLabel(guildMember)}`)
                    .setThumbnail(guildMember.user.displayAvatarURL())
                    .addField("User", guildMember, true)
                    .setColor("#d4b350")
                    .addField("Reason", banReason, true)
                    .setTimestamp()
            });
        });
    }
};

module.exports = onRemove;