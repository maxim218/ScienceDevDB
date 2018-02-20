"use strict";

import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import ResponseWriter from "../HelpingScripts/ResponseWriter";

// класс - контроллер для получения массива пользователей
export default class UsersListGetter {
    // конструктор
    constructor(pg, response) {
        // объект для работы с СУБД
        this.pg = pg;
        // объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод для получения массива пользователей
        this.getListOfUsers();
    }

    // метод для получения массива пользователей
    getListOfUsers() {
        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку запроса в СУБД
        const query = new StringGenerator("get_users_list", []).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}
