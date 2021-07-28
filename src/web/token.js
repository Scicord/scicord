const jwt = require('jsonwebtoken');
const Config = require('../../config/config.json');

const generateAPIToken = ({guild, userID, otp}) => {
    return jwt.sign({guild, userID, otp}, Config.webToken, { expiresIn: '60m' });
}

const verify = (token) => {
    return jwt.verify(token, Config.webToken);
}

module.exports = {
    generateAPIToken, verify
};