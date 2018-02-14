"use strict";

import ContentStringWatcher from "./ContentStringWatcher";

export default class PasswordHashModifier {
    constructor(passwordHash) {
        this.passwordHash = (passwordHash + "").toString();
    }

    modifyIt() {
        const passwordHash = this.passwordHash.toUpperCase();
        let answer = "";

        for(let i = 0; i < passwordHash.length; i++) {
            const c = passwordHash.charAt(i);
            if(ContentStringWatcher.normalChar(c) === true) {
                answer += c;
            } else {
                answer += "A";
            }
        }

        answer = "ABAB" + answer + "ABAB";

        return answer;
    }
};
