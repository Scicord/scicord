const Database = require('sqlite-async');
const EventEmitter = require('events').EventEmitter;
const Punishments = require('./punishments');

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
            this.createTransientChannelsTable(),
            this.createPunishmentLogTable(),
        ]);
    }

    createTransientChannelsTable = () => {
        return this.db.run(`CREATE TABLE IF NOT EXISTS transient_channel (
            id TEXT UNIQUE,
            name TEXT,
            type TEXT,
            time_created INTEGER DEFAULT CURRENT_TIMESTAMP,
            time_destroyed INTEGER)`);
    }

    createPunishmentLogTable = () => {
        return this.db.run(`CREATE TABLE IF NOT EXISTS punishment (
            user TEXT,
            issuer TEXT,
            type TEXT,
            reason TEXT,
            time_created INTEGER DEFAULT CURRENT_TIMESTAMP)`)
    }
    
    getPunishments = () => {
        return new Punishments(this.db);
    }
};