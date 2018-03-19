"use strict";

import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import ResponseWriter from "../HelpingScripts/ResponseWriter";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

// класс - контроллер для получения списка форумов
export default class ForumsListGetter {
    // конструктор
    constructor(pg, response) {
        // объект для работы с СУБД
        this.pg = pg;
        // объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод для получения списка существующих форумов
        this.getListOfExistingForums();
    }

    // метод для получения списка существующих форумов
    getListOfExistingForums() {
        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку запроса в СУБД
        const query = new StringGenerator("get_all_forums", []).generateQueryNoAnswer();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // получаем ответ из базы данных в виде массива
            const arr = res.arr;

            // пробегаемся по всем ячейкам в массиве
            for(let i = 0; i < arr.length; i++) {
                // получаем i-ый элемент массива
                const element = arr[i];
                // преобразуем содержимое форума в человекочитаемый вид
                const newValue =  new StringCodeManager(element.forum_content).decodeString();
                // заменяем содержимое форума на человекочитаемый вид
                element.forum_content = newValue + "";
            }

            // преобразуем массив в JSON строку
            const answer = JSON.stringify(arr);
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}
