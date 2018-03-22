"use strict";

import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ResponseWriter from "../HelpingScripts/ResponseWriter";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

// класс - контроллер для получения сообщений определённого форума
export default class MessagesGetter {
    // конструктор
    constructor(pg, body, SHA256, response) {
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем тело POST запроса
        this.body = body;
        // инициализируем объект для получения HASH от пароля
        this.SHA256 = SHA256;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод получения сообщений определённого форума
        this.getMessagesOfForum();
    }

    // метод получения сообщений определённого форума
    getMessagesOfForum() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие поля ID форума
        // если поле ID форума НЕ передано
        if(new FieldsFinder(body, ["forumID"]).controleFields() === false) {
            // отправляем ответ клиенту, что ID форума НЕ было передано
            new ResponseWriter("__NO_FORUM_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем id форума
        let forumID = (body.forumID + "").toString();

        // если ID форума пусто
        if(forumID === "") {
            // отправляем ответ, что ID форума пусто
            new ResponseWriter("__EMPTY_FORUM_ID__", this.response);
            // выходим из метода
            return;
        }

        // переводим ID форума в целое число
        forumID = parseInt(forumID);

        // если ID форума НЕ является числом
        if(forumID === undefined || forumID === null || isNaN(forumID) === true) {
            // отправляем ответ клиенту, что ID не является числом
            new ResponseWriter("__FORUM_ID_NO_NUMBER__", this.response);
            // выходим из метода
            return;
        }

        // если ID форума слишком большое
        if(forumID > 922337203685477) {
            // отправляем ответ клиенту, что ID форума слишком большое
            new ResponseWriter("__FORUM_ID_VERY_HUGE__", this.response);
            // выходим из метода
            return;
        }

        // если ID меньше нуля
        if(forumID < 0) {
            // отправляем ответ клиенту, что ID меньше нуля
            new ResponseWriter("__FORUM_ID_IS_LESS_ZERO__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем запрос к СУБД
        const query = new StringGenerator("get_forum_messages", [forumID]).generateQueryNoAnswer();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ от БД в массив объектов
            const arr = res.arr;

            // создаём массив для хранения результата
            const answer = [];

            // формируем результирующий массив
            arr.forEach((element) => {
                answer.push({
                    m_id: element.hh_message_id,
                    m_user: element.hh_message_user,
                    m_forum: element.hh_message_forum_id,
                    m_content: new StringCodeManager(element.hh_message_content).decodeString()
                });
            });

            // сохраняем результирующий массив в JSON строку
            const answerJsonStr = JSON.stringify(answer);

            // отправляем ответ клиенту
            new ResponseWriter(answerJsonStr, this.response);
        });
    }
}
