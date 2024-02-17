"use strict";

const Discord = require("discord.js");
const config = require('../../config/config.json');
const events = require('../events');
const DB = require('../db/db');
const log = require('../utils/logger')();


module.exports = class BotClient 
{
    constructor(config)
    {
        this.token = config.token;
        this.prefix = config.prefix;        
        this.client = new Discord.Client();
        this.db = new DB(config);
        this.disableEvents = config.disableEvents;
    }

    init = () => {
        Object.entries(events).forEach(([eventName, eventFn]) => {
            if (this.disableEvents && this.disableEvents.includes(eventName))
                return

            log.info(`Setting up callback for ${eventName}`);
            this.client.on(eventName, (...args) => {
                eventFn(this, ...args);
            });
        });

        this.db.init().then(res => {
            log.info("Database is ready");
        });
    }

    connect = () => {
        this.init();
        this.client.login(this.token);
    }

    auditLog = (message) => {
        const auditChannel = this.client.channels.cache.find(c => c.name === config.auditChannel);
        if(!auditChannel)
            return;
        auditChannel.send(message);            
    }

    transientChannels = () => {
        return this.db.getTransientChannels();
    }

    punishmentLog = () => {
        return this.db.getPunishments();
    }

    authTable = () => {
        return this.db.getAuth();
    }

    temporaryRoles = () => {
        return this.db.getTemporaryRoles()
    }
};