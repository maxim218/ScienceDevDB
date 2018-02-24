"use strict";

import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ResponseWriter from "../HelpingScripts/ResponseWriter";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";

// класс - контроллер для авторизации пользователя по его логину и Hash от пароля
export default class AuthUserByHash {
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
        // вызываем метод авторизации пользователя по его логину и Hash от пароля
        this.authUserByHisPasswordHash();
    }

    // метод авторизации пользователя по логину и HASH от пароля
    authUserByHisPasswordHash() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new FieldsFinder(body, ["loginField", "passwordField"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new ResponseWriter("__NOT_ALL_FIELDS_SENT__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();

        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что логин или пароль НЕ заполнены
            new ResponseWriter("__LOGIN_OR_PASSWORD_ARE_EMPTY__", this.response);
            // выходим из метода
            return;
        }

        // если логин имеет длину, которая больше 10-ти символов
        if(login.length > 10) {
            // отправляем ответ клиенту, что логин имеет слишком большую длину
            new ResponseWriter("__LONG_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если логин или пароль содержат запретные символы
        if(new ContentStringWatcher(login).normalString() === false || new ContentStringWatcher(password).normalString() === false) {
            // отправляем ответ клиенту, что логин или пароль содержат запретные символы
            new ResponseWriter("__BAD_CHARS_LOGIN_OR_PASSWORD_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку для отправки запроса в СУБД
        const query = new StringGenerator("normal_login_password", [login, password]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}
