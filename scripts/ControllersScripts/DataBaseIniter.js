"use strict";

import QuerySender from "../HelpingScripts/QuerySender";
import ResponseWriter from "../HelpingScripts/ResponseWriter";

export default class DataBaseIniter {
    constructor(fs, pg, response) {
        this.fs = fs;
        this.pg = pg;
        this.response = response;
        this.readSqlFromFileAndInitDB();
    }

    readSqlFromFileAndInitDB() {
        const fs = this.fs;
        const pg = this.pg;
        const response = this.response;

        fs.readFile("database.sql", function(err, data) {
            const content = data.toString();
            new QuerySender(pg).makeQuery(content, {}, () => {
               new ResponseWriter("__INIT_DATABASE_OK__", response);
            });
        });
    }
}
