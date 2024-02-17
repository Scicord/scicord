module.exports = class Entity 
{
    constructor(db) {
        this.db = db;
    }

    prepareAndRun = (query, ...rest) => {
        return this.db.prepare(query).then(stmt => {
            return stmt.run(...rest).then(res => {
                stmt.finalize();
                return res;
            })
        });
    }

    prepareAndQuery = (query, ...rest) => {
        return this.db.prepare(query).then(stmt => {
            return stmt.all(...rest).then(res => {
                stmt.finalize();
                return res;
            })
        });
    }

    createTable = () => {
        throw new Error("Not implemented here");
    }
}