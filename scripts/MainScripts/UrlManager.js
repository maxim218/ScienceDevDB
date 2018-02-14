"use strict";

import AboutServerController from "../ControllersScripts/AboutServerController";
import ModuleImporter from "../HelpingScripts/ModuleImporter";
import DataBaseIniter from "../ControllersScripts/DataBaseIniter";
import UserRegistrator from "../ControllersScripts/UserRegistrator";
import UserAuthorizer from "../ControllersScripts/UserAuthorizer";
import RecordAdder from "../ControllersScripts/RecordAdder";

export default class UrlManager {
    constructor(app) {
        this.app = app;
        this.pg = new ModuleImporter("pg").getModule();
        this.SHA256 = new ModuleImporter("crypto-js/sha256").getModule();
        this.fs = new ModuleImporter("fs").getModule();
    }

    routeQuery(request, response, operation, url, body) {
        if(operation === "about_server") {
            new AboutServerController(response);
            return;
        }

        if(operation === "init_database") {
            new DataBaseIniter(this.fs, this.pg, response);
            return;
        }

        if(operation === "registrate_user") {
            new UserRegistrator(this.pg, body, this.SHA256, response);
            return;
        }

        if(operation === "authorize_user") {
            new UserAuthorizer(this.pg, body, this.SHA256, response);
            return;
        }

        if(operation === "add_record") {
            new RecordAdder(this.pg, body, this.SHA256, response);
        }
    }
}
