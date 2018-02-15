"use strict";

import ResponseWriter from "../HelpingScripts/ResponseWriter";
import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import PasswordHashModifier from "../HelpingScripts/PasswordHashModifier";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

export default class RecordsGetter {
    constructor(pg, body, response) {
        this.pg = pg;
        this.body = body;
        this.response = response;
        this.getRecords();
    }

    getRecords() {
        const body = this.body;

        if(new FieldsFinder(body, ["loginField"]).controleFields() === false) {
            new ResponseWriter("__FIELD_NOT_FOUND__", this.response);
            return;
        }

        const login = (body.loginField + "").toString();

        if(login === "") {
            new ResponseWriter("__LOGIN_FIELD_EMPTY__", this.response);
            return;
        }

        if(login.length > 10) {
            new ResponseWriter("__LONG_FIELD_VERY_LONG__", this.response);
            return;
        }

        if(new ContentStringWatcher(login).normalString() === false) {
            new ResponseWriter("__BAD_CHARS_FIELD_LOGIN__", this.response);
            return;
        }

        let res = {
            arr: []
        };

        const query = new StringGenerator("get_records_of_user", [login]).generateQueryNoAnswer();
        new QuerySender(this.pg).makeQuery(query, res, () => {
            const mass = res.arr;
            const answer = [];

            for(let i = 0; i < mass.length; i++) {
                const element = mass[i];
                const contentString = new StringCodeManager(element.record_content_t + "").decodeString();

                answer.push({
                    r_id: element.record_id_t,
                    m_id: element.man_id_t,
                    m_nn: element.man_nickname_t,
                    r_cc: contentString
                })
            }

            new ResponseWriter(JSON.stringify(answer), this.response);
        });
    }
}
