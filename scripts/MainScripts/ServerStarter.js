"use strict";

import ModuleImporter from "../HelpingScripts/ModuleImporter";
import QueryGetter from "./QueryGetter";

class ServerStarter {
    constructor(portNumber) {
        let express = new ModuleImporter("express").getModule();
        this.app = express();
        this.allowQueries();
        this.startServer(portNumber);
        this.queryGetter = new QueryGetter(this.app);
    }

    allowQueries() {
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    startServer(portNumber) {
        const port = process.env.PORT || portNumber;
        this.app.listen(port);
        console.log("------------------------------------------");
        console.log("Server works on port " + port);
        console.log("------------------------------------------");
    }
}

const serverStarter = new ServerStarter(5000);

