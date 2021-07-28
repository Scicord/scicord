const Command = require('./command');
const { MessageEmbed } = require('discord.js');

module.exports = class OTP extends Command {
    botPermissionsToExecute = () => {
        return [];
    }

    userPermissionsToExecute = () => {
        return ['BAN_MEMBERS'];
    }

    usage = (isError) => {
        return new MessageEmbed()
            .setTitle("OTP")
            .setDescription(`Usage: \`>otp\``)
            .addFields({name: 'Important Note!', value: 'You must be able to receive DMs from the bot!'})
            .setFooter(isError ? "An error has occurred" : "Usage instructions");
    }

    execute = (botClient, message) => {
        const user = message.author;
        const guild = message.guild;
        const auth = botClient.authTable();     
        const otp = (Math.floor(Math.random() * 900000) + 100000).toString();   
        auth.revokeTokenForGuildMember(guild.id, user.id).then(res => {
            return auth.createOtp(guild.id, user.id, otp);
        }).then(res => {
            user.send(`Your OTP is ${otp}`);
        });
    }

}