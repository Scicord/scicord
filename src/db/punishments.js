"use strict";

const Entity = require("./entity");

module.exports = class Punishments extends Entity {
    static PUNISHMENT_TYPE_WARN = 'warn';
    static PUNISHMENT_TYPE_QUARANTINE = 'quarantine';

    constructor(db) {
        super(db);
    }
    
    addWarn = (user, issuer, reason) => {
        return this.prepareAndRun(`INSERT INTO punishment (user,issuer,type,reason) VALUES (?,?,?,?)`,
            user, issuer, Punishments.PUNISHMENT_TYPE_WARN, reason);
    }

    addQuarantine = (user, issuer, reason) => {
        return this.prepareAndRun(`INSERT INTO punishment (user,issuer,type,reason) VALUES (?,?,?,?)`, 
            user, issuer, Punishments.PUNISHMENT_TYPE_QUARANTINE, reason);
    }

    punishmentsForUser = (user) => {
        return this.prepareAndQuery(`SELECT * from punishment WHERE user=?`, user);
    }

    createTable = () => {
        return this.db.run(`CREATE TABLE IF NOT EXISTS punishment (
            user TEXT,
            issuer TEXT,
            type TEXT,
            reason TEXT,
            time_created INTEGER DEFAULT CURRENT_TIMESTAMP)`)
    }
}