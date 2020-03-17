"use strict";

const Discord = require("discord.js");
const config = require('../config/config.json');
const events = require('./events');

module.exports = class BotClient 
{
    constructor(config)
    {
        this.token = config.token;
        this.prefix = config.prefix;        
        this.client = new Discord.Client();
    }

    init = () => {
        Object.entries(events).forEach(([eventName, eventFn]) => {
            console.log(`Setting up callback for ${eventName}`);
            this.client.on(eventName, (...args) => {
                eventFn(this, ...args);
            });
        });
    }

    connect = () => {
        this.init();
        this.client.login(this.token);
    }
};