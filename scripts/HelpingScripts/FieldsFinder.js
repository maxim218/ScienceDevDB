"use strict";

export default class FieldsFinder {
    constructor(obj, fieldsArray) {
        this.obj = obj;
        this.fieldsArray = fieldsArray;
    }

    controleFields() {
        const obj = this.obj;
        const fieldsArray = this.fieldsArray;

        for(let i = 0; i < fieldsArray.length; i++) {
            const fieldName = fieldsArray[i].toString();
            if(obj[fieldName] === null || obj[fieldName] === undefined) {
                return false;
            }
        }

        return true;
    }
}
