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

    createOtp = (guild, user, otp, validFor = 60 * 60) => {
        return this.prepareAndRun(`INSERT INTO auth (guild, user, otp, valid_seconds) VALUES (?,?,?,?)`,
            guild, user, otp, validFor);
    }

    updateToken = (guild,user,otp,token) => {
        return this.prepareAndRun('UPDATE auth SET token=? WHERE guild=? AND user=? AND otp=?', 
            token, guild, user, otp);
    }

    revokeTokenForGuildMember = (guild, user) => {
        return this.prepareAndRun(`UPDATE auth SET valid_seconds=0 WHERE guild=? AND user=?`, guild, user);
    }

    isTokenValid = (token) => {
        return this.prepareAndQuery(`SELECT count(*) as cnt FROM auth WHERE token=? AND (datetime('now', 'localtime') - datetime(time_created, 'localtime')) < valid_seconds`,
            token).then(r => {
                return r[0].cnt > 0;
            });
    }

    getValidToken = (guild, user) => {
        return this.prepareAndQuery(`SELECT otp,token FROM auth WHERE guild=? AND user=? AND (datetime('now', 'localtime') - datetime(time_created, 'localtime')) < valid_seconds`,
            guild, user);
    }
}