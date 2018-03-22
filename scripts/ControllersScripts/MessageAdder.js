"use strict";

import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ResponseWriter from "../HelpingScripts/ResponseWriter";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

// класс - контроллер для добавления сообщения форума
export default class MessageAdder {
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
        // вызываем метод добавления сообщения форума
        this.insertNewMessageToForum();
    }

    // метод добавления сообщения форума
    insertNewMessageToForum() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new FieldsFinder(body, ["loginField", "passwordField", "forumID", "messageContent"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new ResponseWriter("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();
        // сохраняем id форума
        let forumID = (body.forumID + "").toString();
        // сохраняем текст сообщения
        const messageContent = (body.messageContent + "").toString();

        // если логин пустой
        if(login === "") {
            // отправляем ответ, что логин пустой
            new ResponseWriter("__EMPTY_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если пароль пустой
        if(password === "") {
            // отправляем ответ, что пароль пустой
            new ResponseWriter("__EMPTY_PASSWORD__", this.response);
            // выходим из метода
            return;
        }

        // если ID форума пусто
        if(forumID === "") {
            // отправляем ответ, что ID форума пусто
            new ResponseWriter("__EMPTY_FORUM_ID__", this.response);
            // выходим из метода
            return;
        }

        // если содержимое сообщения пусто
        if(messageContent === "") {
            // отправляем ответ, что содержимое сообщения пусто
            new ResponseWriter("__EMPTY_MESSAGE_CONTENT__", this.response);
            // выходим из метода
            return;
        }

        // если логин длиннее 10-ти символов
        if(login.length > 10) {
            // отправляем ответ клиенту, что логин слишком длинный
            new ResponseWriter("__VERY_LONG_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если логин содержит запретные символы
        if(new ContentStringWatcher(login).normalString() === false) {
            // отправляем ответ, что логин содержит запретные символы
            new ResponseWriter("__BAD_CHARS_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если пароль содержит запретные символы
        if(new ContentStringWatcher(password).normalString() === false) {
            // отправляем ответ, что пароль содержит запретные символы
            new ResponseWriter("__BAD_CHARS_PASSWORD__", this.response);
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
        const query = new StringGenerator("add_message", [login, password, forumID, new StringCodeManager(messageContent).codeString()]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}
