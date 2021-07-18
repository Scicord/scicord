let currentSecret = '0';
let lastSecret = '0';
const generateSecret = () => {
    lastSecret = currentSecret;
    currentSecret = (Math.floor(Math.random() * 90000) + 10000).toString();
    setTimeout(generateSecret, 60000);
};

const getSecret = () => currentSecret;

const secretOk = (userAttempt) => {
    return currentSecret === userAttempt || lastSecret === userAttempt;
}

const greet = (channel, guildMember) => {
    const Config = require('../../config/command/ihavereadtherules.json')
    let rules = Config.ruleText.join('\n').replace("{{randomNumber}}", getSecret());
    rules = `Hello <@${guildMember.id}>!\n` + rules;
    channel.send(rules);
}

module.exports = {
    "generateSecret": generateSecret,
    "secretOk": secretOk,
    "greet": greet
}