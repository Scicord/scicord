"use strict";

const Entity = require("./entity");

module.exports = class TransientChannels extends Entity {
    static TRANSIENT_CHANNEL_TYPE_QUARANTINE = 'quarantine';
    static TRANSIENT_CHANNEL_TYPE_WELCOME = 'welcome';

    constructor(db) {
        super(db);
    }

    createTable = () => {
        return this.db.run(`CREATE TABLE IF NOT EXISTS transient_channel (
            id TEXT UNIQUE,
            user TEXT,
            type TEXT,
            time_created DATETIME DEFAULT CURRENT_TIMESTAMP,
            time_destroyed DATETIME)`);
    }

    addChannel = (channel, user, type) => {
        return this.prepareAndRun(`INSERT INTO transient_channel (id, user, type) VALUES (?,?,?)`,
            channel, user, type);
    }

    destroyChannel = (channel) => {
        return this.prepareAndRun(`UPDATE transient_channel SET time_destroyed=? WHERE id=?`, 
            Date.now(), channel);
    }

    channelsForUser = (user, type) => {
        return this.prepareAndQuery(`SELECT * from transient_channel WHERE user=? AND type=?`, user, type);
    }

    activeChannel = (channel) => {
        return this.prepareAndQuery(`SELECT * from transient_channel WHERE id=? AND time_destroyed IS NULL`, channel);
    }

    activeChannelsForUser = (user, type) => {
        return this.prepareAndQuery(`SELECT * from transient_channel WHERE user=? AND type=? AND time_destroyed IS NULL`, user, type);
    }

    inactiveChannel = (channel) => {
        return this.prepareAndQuery(`SELECT * from transient_channel WHERE id=? AND time_destroyed IS NOT NULL`, channel);
    }
}