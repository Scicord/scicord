"use strict";

module.exports = class Punishments {
    static PUNISHMENT_TYPE_WARN = 'warn';
    static PUNISHMENT_TYPE_QUARANTINE = 'quarantine';

    constructor(db) {
        this.db = db;
    }
    
    addWarn = (user, issuer, reason) => {
        return this.db.prepare(`INSERT INTO punishment (user,issuer,type,reason) VALUES (?,?,?,?)`)
            .then(stmt => {
                return stmt.run(user, issuer, Punishments.PUNISHMENT_TYPE_WARN, reason).then(res => {
                    stmt.finalize();
                    return res;
                })
            });
    }

    addQuarantine = (user, issuer, reason) => {
        return this.db.prepare(`INSERT INTO punishment (user,issuer,type,reason) VALUES (?,?,?,?)`)
            .then(stmt => {
                return stmt.run(user, issuer, Punishments.PUNISHMENT_TYPE_QUARANTINE, reason).then(res => {
                    stmt.finalize();
                    return res;
                });
            });
    }

    punishmentsForUser = (user) => {
        return this.db.prepare(`SELECT * from punishment WHERE user=?`)
            .then(stmt => {
                return stmt.all(user).then(res => {
                    stmt.finalize();
                    return res;
                })
            });
    }
}