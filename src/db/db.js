const Database = require('sqlite-async');
const EventEmitter = require('events').EventEmitter;
const TransientChannels = require('./transientchannels');
const Punishments = require('./punishments');
const Auth = require('./auth');

module.exports = class DB {
    constructor(config) {
        this.config = config;
    }

    init = () => {
        return Database.open(this.config.dbPath).then(db => {
            this.db = db;
            return this.createTables();
        });
    }

    createTables = () => {
        return Promise.all([
            this.getTransientChannels().createTable(),
            this.getPunishments().createTable(),
            this.getAuth().createTable()
        ]);
    }

    getAuth = () => {
        return new Auth(this.db);
    }

    getTransientChannels = () => {
        return new TransientChannels(this.db);
    }
    
    getPunishments = () => {
        return new Punishments(this.db);
    }
};