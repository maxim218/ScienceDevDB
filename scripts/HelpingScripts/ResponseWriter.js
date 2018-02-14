"use strict";

export default class ResponseWriter {
    constructor(message, response) {
        this.setMessage(message);
        this.setResponse(response);
        this.sendAnswerToClient();
    }

    setMessage(message) {
        this.messageContent = message.toString();
    }

    setResponse(response) {
        this.response = response;
    }

    sendAnswerToClient() {
        this.response.status(200);
        console.log("Answer: " + this.messageContent);
        console.log("------------------------------------------");
        this.response.end(this.messageContent);
    }
}
