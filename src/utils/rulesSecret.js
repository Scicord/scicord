const log = require('./logger')();
let currentSecret = '0';
let lastSecret = '0';
const generateSecret = () => {
    lastSecret = currentSecret;
    currentSecret = (Math.floor(Math.random() * 90000) + 10000).toString();
    log.info(`New secret generated, last=${lastSecret}, current=${currentSecret}`);
    setTimeout(generateSecret, 300000);
};

const getSecret = () => currentSecret;

const secretOk = (userAttempt) => {
    return currentSecret === userAttempt || lastSecret === userAttempt;
}

const greet = (channel, guildMember) => {    
    const Config = require('../../config/command/ihavereadtherules.json')
    log.info(`Greeting user ${guildMember.user.username}#${guildMember.user.discriminator} in ${channel.name}`);
    let rules = Config.ruleText.join('\n').replace("{{randomNumber}}", getSecret());
    rules = `Hello <@${guildMember.id}>!\n` + rules;
    channel.send(rules);
}

module.exports = {
    "generateSecret": generateSecret,
    "secretOk": secretOk,
    "greet": greet
}