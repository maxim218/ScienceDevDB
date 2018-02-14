"use strict";

export default class StringCodeManager {
    constructor(stringParam) {
        this.s = (stringParam + "").toString();
    }

    static getNumberOfChar(c) {
        return c.charCodeAt(0);
    }

    codeString() {
        const s = this.s;
        const mass = [];

        for(let i = 0; i < s.length; i++) {
            const c = s.charAt(i);
            const n = StringCodeManager.getNumberOfChar(c);
            mass.push(n);
        }

        return mass.join("_");
    }

    decodeString() {
        const s = (this.s + "").toString();
        const mass = s.split("_");

        let answer = "";

        for(let i = 0; i < mass.length; i++) {
            const n = mass[i];
            answer += String.fromCharCode(n);
        }

        return answer;
    }
}
