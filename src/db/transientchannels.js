"use strict";

module.exports = class TransientChannels {
    static TRANSIENT_TYPE_QUARANTINE = 'quarantine';

    constructor(db) {
        this.db = db;
    }

    addQuarantine = (user, channel) => {
        return this.db.prepare(`INSERT INTO transient_channel (id,user,type) VALUES (?,?,?)`)
            .then(stmt => {
                return stmt.run(channel, user, TransientChannels.TRANSIENT_TYPE_QUARANTINE).then(res => {
                    stmt.finalize();
                    return res;
                });
            });
    }

    quarantineChannelsforUser = (user) => {
        return this.db.prepare(`SELECT * from transient_channel WHERE user=?`)
            .then(stmt => {
                return stmt.all(user).then(res => {
                    stmt.finalize();
                    return res;
                })
            });
    }
}