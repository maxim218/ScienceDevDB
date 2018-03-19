"use strict";

import ResponseWriter from "../HelpingScripts/ResponseWriter";
import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

// класс - контроллер для добавления нового форума
export default class ForumAdder {
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
        // вызываем метод для добавления нового форума
        this.pushNewForum();
    }

    // метод для добавления нового форума
    pushNewForum() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new FieldsFinder(body, ["loginField", "passwordField", "forumField"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new ResponseWriter("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();
        // сохраняем формулировку форума
        const forum = (body.forumField + "").toString();

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

        // если формулировка форума пустая
        if(forum === "") {
            // отправляем ответ, что формулировка форума пустая
            new ResponseWriter("__EMPTY_FORUM__", this.response);
            // выходим из метода
            return;
        }

        // если логин слишком длинный
        if(login.length > 10) {
            // отправляем ответ, что логин слишком длинный
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

        // если пароль содержит запртеные символы
        if(new ContentStringWatcher(password).normalString() === false) {
            // отправляем ответ, что пароль содержит запретные символы
            new ResponseWriter("__BAD_CHARS_PASSWORD__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку для отправки запроса в СУБД
        const query = new StringGenerator("add_forum", [login, password, new StringCodeManager(forum).codeString()]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}
