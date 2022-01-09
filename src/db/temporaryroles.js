"use strict";

const Entity = require("./entity");

module.exports = class TemporaryRoles extends Entity {

    constructor(db) {
        super(db);
    }

    createTable = () => {
        return this.db.run(`CREATE TABLE IF NOT EXISTS temporary_roles (
            user TEXT,
            role TEXT)`);
    }

    addTemporaryRole = (user, role) => {
        return this.prepareAndRun(`INSERT INTO temporary_roles (user, role) VALUES (?,?)`,
            user, role);
    }

    getTemporaryRoles = (user) => {
        return this.prepareAndQuery(`SELECT * from temporary_roles WHERE user=?`, user);
    }

    removeTemporaryRoles = (user) => {
        return this.prepareAndQuery(`DELETE FROM temporary_roles WHERE user=?`, user);
    }
}