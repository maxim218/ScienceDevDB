"use strict";

import ResponseWriter from "../HelpingScripts/ResponseWriter";

// класс-контроллер для получения информации о сервере
export default class AboutServerController {
    // конструктор
    constructor(response) {
        // задаём текст сообщения с информацией
        const answer = "__DATABASE_SERVER_CREATED_BY_KOLOTOVKIN_MAXIM__";
        // отправляем информацию о сервере клиенту
        new ResponseWriter(answer, response);
    }
}
