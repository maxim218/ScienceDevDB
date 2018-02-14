"use strict";

export default class ContentStringWatcher {
    constructor(s) {
        this.s = s;
    }

    static normalChar(charParam) {
        const c = charParam.toLowerCase();
        const allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789";
        return allowedChars.indexOf(c) !== -1;
    }

    normalString() {
        const s = this.s;
        for(let i = 0; i < s.length; i++) {
            const c = s.charAt(i);
            if(ContentStringWatcher.normalChar(c) === false) {
                return false;
            }
        }
        return true;
    }
}
