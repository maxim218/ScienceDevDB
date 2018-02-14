"use strict";

import UrlManager from "./UrlManager";
import ResponseWriter from "../HelpingScripts/ResponseWriter";

export default class QueryGetter {
    constructor(app) {
        this.app = app;
        this.useGetQueries();
        this.usePostQueries();
        this.urlManager = new UrlManager(this.app);

        this.allowedOperations = [
            "about_server",
            "init_database",
            "registrate_user",
            "authorize_user",
            "add_record",
        ];
    }

    static printInfo(type, request, response, operation, body) {
        console.log("Method: " + type);
        console.log("Url: " + request.url);
        console.log("Operation: " + operation);

        if(type === "POST") {
            console.log("Body: " + body);
        }
    }

    static getOperation(url) {
        const mass = url.toString().split("/");
        return mass[1];
    }

    useGetQueries() {
        this.app.get('/*', (request, response) => {
            const url = request.url;
            const operation = QueryGetter.getOperation(url);
            QueryGetter.printInfo("GET", request, response, operation, null);
            if(this.allowedOperations.indexOf(operation) === -1) {
                new ResponseWriter("__NOT_ALLOWED_OPERATION__", response);
            } else {
                this.urlManager.routeQuery(request, response, operation, url, null);
            }
        });
    }

    usePostQueries() {
        this.app.post('/*', (request, response) => {
            const url = request.url;
            const operation = QueryGetter.getOperation(url);
            if(this.allowedOperations.indexOf(operation) === -1) {
                new ResponseWriter("__NOT_ALLOWED_OPERATION__", response);
            } else {
                let dataString = "";
                request.on('data', (data) => {
                    dataString += data;
                }).on('end', () => {
                    try {
                        QueryGetter.printInfo("POST", request, response, operation, dataString);
                        const body = JSON.parse(dataString);
                        this.urlManager.routeQuery(request, response, operation, url, body);
                    } catch (err) {
                        console.log("ERROR: " + err);
                        new ResponseWriter("__JSON_ERROR__", response);
                    }
                });
            }
        });
    }
}

