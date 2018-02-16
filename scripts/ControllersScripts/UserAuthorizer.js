"use strict";

import ResponseWriter from "../HelpingScripts/ResponseWriter";
import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import PasswordHashModifier from "../HelpingScripts/PasswordHashModifier";

// класс-контроллер для авторизации пользователя
export default class UserAuthorizer {
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
        // вызываем метод авторизации пользователя
        this.authorizeUser();
    }

    // метод для авторизации пользователя
    authorizeUser() {
        // получаем тело POST запроса
        const body = this.body;

        // проверяем наличие необходимых полей в теле запроса
        // если НЕ все необходимые поля переданы
        if(new FieldsFinder(body, ["loginField", "passwordField"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new ResponseWriter("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();

        // проверяем логин и пароль на пустоту
        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что имеются незаполненные поля
            new ResponseWriter("__EMPTY_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // проверяем логин и пароль на длину
        // если логин или пароль имеют длину, которая больше 10-ти символов
        if(login.length > 10 || password.length > 10) {
            // отправляем ответ, что поля имеют слишком большую длину
            new ResponseWriter("__LONG_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // проверяем поля на наличие запретных символов
        // если логин или пароль содержат запретные символы
        if(new ContentStringWatcher(login).normalString() === false || new ContentStringWatcher(password).normalString() === false) {
            // отправляем ответ клиенту, что поля содержат запретные символы
            new ResponseWriter("__BAD_CHARS_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку для отправки запроса в СУБД
        // при этом пароль преобразуется в HASH строку
        const query = new StringGenerator("normal_login_password", [login, new PasswordHashModifier(this.SHA256(password)).modifyIt()]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ от СУБД в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}
