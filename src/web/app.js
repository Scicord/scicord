const express = require('express');
const jwt = require('jsonwebtoken');
const Config = require('../../config/config.json');

const generateAPIToken = ({guild, userID, otp}) => {
    return jwt.sign({guild, userID, otp}, Config.webToken, { expiresIn: '60m' });
}

const initWeb = (botClient) => {
    const app = express();

    return app;
}