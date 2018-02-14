"use strict";

import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import ResponseWriter from "../HelpingScripts/ResponseWriter";
import PasswordHashModifier from "../HelpingScripts/PasswordHashModifier";

export default class UserRegistrator {
    constructor(pg, body, SHA256, response) {
        this.pg = pg;
        this.body = body;
        this.SHA256 = SHA256;
        this.response = response;
        this.registrateUser();
    }

    registrateUser() {
        const body = this.body;

        if(new FieldsFinder(body, ["loginField", "passwordField"]).controleFields() === false) {
            new ResponseWriter("__NOT_ALL_FIELDS__", this.response);
            return;
        }

        const login = (body.loginField + "").toString();
        const password = (body.passwordField + "").toString();

        if(login === "" || password === "") {
            new ResponseWriter("__EMPTY_FIELD__", this.response);
            return;
        }

        if(login.length > 10 || password.length > 10) {
            new ResponseWriter("__LONG_FIELD__", this.response);
            return;
        }

        if(new ContentStringWatcher(login).normalString() === false || new ContentStringWatcher(password).normalString() === false) {
            new ResponseWriter("__BAD_CHARS_FIELD__", this.response);
            return;
        }

        let res = {
            arr: []
        };

        const query = new StringGenerator("add_user", [login, new PasswordHashModifier(this.SHA256(password)).modifyIt()]).generateQuery();
        new QuerySender(this.pg).makeQuery(query, res, () => {
            const answer = res.arr[0].answer.toString();
            new ResponseWriter(answer, this.response);
        });
    }
}