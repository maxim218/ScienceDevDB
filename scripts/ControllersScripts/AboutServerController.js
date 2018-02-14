"use strict";

import ResponseWriter from "../HelpingScripts/ResponseWriter";

export default class AboutServerController {
    constructor(response) {
        const answer = "__DATABASE_SERVER_CREATED_BY_KOLOTOVKIN_MAXIM__";
        new ResponseWriter(answer, response);
    }
}
