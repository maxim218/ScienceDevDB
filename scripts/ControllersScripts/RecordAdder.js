"use strict";

import ResponseWriter from "../HelpingScripts/ResponseWriter";
import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

export default class RecordAdder {
    constructor(pg, body, SHA256, response) {
        this.pg = pg;
        this.body = body;
        this.SHA256 = SHA256;
        this.response = response;
        this.addRecord();
    }

    addRecord() {
        const body = this.body;

        if(new FieldsFinder(body, ["loginField", "passwordField", "contentField"]).controleFields() === false) {
            new ResponseWriter("__NOT_ALL_FIELDS__", this.response);
            return;
        }

        const login = (body.loginField + "").toString();
        const password = (body.passwordField + "").toString();
        const content = (body.contentField + "").toString();

        if(login === "" || password === "") {
            new ResponseWriter("__EMPTY_LOGIN_OR_PASSWORD__", this.response);
            return;
        }

        if(content === "") {
            new ResponseWriter("__EMPTY_CONTENT__", this.response);
            return;
        }

        if(login.length > 10) {
            new ResponseWriter("__LONG_LOGIN__", this.response);
            return;
        }

        if(content.length > 400) {
            new ResponseWriter("__LONG_CONTENT__", this.response);
            return;
        }

        if(new ContentStringWatcher(login).normalString() === false || new ContentStringWatcher(password).normalString() === false) {
            new ResponseWriter("__BAD_CHARS_FIELD_LOGIN_OR_PASSWORD__", this.response);
            return;
        }

        let res = {
            arr: []
        };

        const query = new StringGenerator("add_record", [login, password, new StringCodeManager(content).codeString()]).generateQuery();
        new QuerySender(this.pg).makeQuery(query, res, () => {
            const answer = res.arr[0].answer.toString();
            new ResponseWriter(answer, this.response);
        });
    }
}
