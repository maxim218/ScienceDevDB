"use strict";

export default class StringGenerator {
    constructor(functionName, paramsArray) {
        this.functionName = functionName;
        this.paramsArray = paramsArray;
    }

    generateQuery() {
        const functionName = this.functionName;
        const paramsArray = this.paramsArray;

        for(let i = 0; i < paramsArray.length; i++) {
            paramsArray[i] = "'" + paramsArray[i] + "'";
        }

        const queryString = " SELECT * FROM " + functionName + "(" + paramsArray.join(",") + ") AS answer; ";
        console.log("Query: " + queryString);

        return queryString;
    }

    generateQueryNoAnswer() {
        const functionName = this.functionName;
        const paramsArray = this.paramsArray;

        for(let i = 0; i < paramsArray.length; i++) {
            paramsArray[i] = "'" + paramsArray[i] + "'";
        }

        const queryString = " SELECT * FROM " + functionName + "(" + paramsArray.join(",") + "); ";
        console.log("Query: " + queryString);

        return queryString;
    }
}
