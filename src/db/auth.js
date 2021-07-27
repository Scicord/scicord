const Entity = require("./entity");

"use strict";

module.exports = class Auth extends Entity
{
    constructor(db) {
        super(db);
    }

    createTable = () => {
        return this.db.run(`CREATE TABLE IF NOT EXISTS auth (
            guild TEXT,
            user TEXT,
            otp TEXT,
            token TEXT,
            time_created DATETIME DEFAULT CURRENT_TIMESTAMP,
            valid_seconds INTEGER)`);
    }

    createToken = (token, guild, user, otp, validFor = 60 * 60) => {
        return this.prepareAndRun(`INSERT INTO auth (guild, user, otp, token, valid_seconds) VALUES (?,?,?,?,?)`,
            guild, user, otp, token, validFor);
    }

    revokeTokenForGuildMember = (guild, user) => {
        return this.prepareAndRun(`UPDATE auth SET valid_seconds=0 WHERE guild=? AND user=?`, guild, user);
    }

    getValidToken = (guild, user) => {
        return this.prepareAndQuery(`SELECT otp,token FROM auth WHERE guild=? AND user=? AND (datetime('now', 'localtime') - datetime(time_created, 'localtime')) < valid_seconds`,
            guild, user);
    }
}