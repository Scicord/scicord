"use strict";

module.exports = class TransientChannels {
    static TRANSIENT_CHANNEL_TYPE_QUARANTINE = 'quarantine';
    static TRANSIENT_CHANNEL_TYPE_WELCOME = 'welcome';

    constructor(db) {
        this.db = db;
    }

    addChannel = (channel, user, type) => {
        return this.db.prepare(`INSERT INTO transient_channel (id, user, type) VALUES (?,?,?)`)
            .then(stmt => {
                return stmt.run(channel, user, type).then(res => {
                    stmt.finalize();
                    return res;
                });
            });
    }

    destroyChannel = (channel) => {
        return this.db.prepare(`UPDATE transient_channel SET time_destroyed=? WHERE id=?`)
            .then(stmt => {
                return stmt.run(Date.now(), channel).then(res => {
                    stmt.finalize();
                    return res;
                })
            })
    }

    channelsForUser = (user, type) => {
        return this.db.prepare(`SELECT * from transient_channel WHERE user=? AND type=?`)
            .then(stmt => {
                return stmt.all(user, type).then(res => {
                    stmt.finalize();
                    return res;
                })
            });
    }

    activeChannelsForUser = (user, type) => {
        return this.db.prepare(`SELECT * from transient_channel WHERE user=? AND type=? AND time_destroyed IS NULL`)
            .then(stmt => {
                return stmt.all(user, type).then(res => {
                    stmt.finalize();
                    return res;
                })
            });
    }
}