const Command = require('./command');
const { MessageEmbed } = require('discord.js');
const CommandConfig = require('../config/commandConfig');

module.exports = class OTP extends Command {
    constructor()
    {
        super();
        this.config = new CommandConfig(require('../../config/command/otp.json'));
    }

    commandConfig = () => {
        return this.config;
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