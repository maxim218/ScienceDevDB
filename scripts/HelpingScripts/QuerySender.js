"use strict";

export default class QuerySender {
    constructor(pg) {
        this.pg = pg;
    }

    createNewClient() {
        const pg = this.pg;
        return new pg.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'sciencedevdb',
            password: '123',
            port: 5432
        });
    }

    makeQuery(query, resultObj, callback) {
        const client = this.createNewClient();
        client.connect();

        client.query(query, (err, res) => {
            if(err !== null && err !== undefined) {
                console.log(err);
            }

            resultObj.arr = res.rows;
            client.end();
            callback();
        });
    }
}
