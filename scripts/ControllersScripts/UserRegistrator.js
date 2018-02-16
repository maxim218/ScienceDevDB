"use strict";

import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import ResponseWriter from "../HelpingScripts/ResponseWriter";
import PasswordHashModifier from "../HelpingScripts/PasswordHashModifier";

// класс-контроллер для регистрации пользователя
export default class UserRegistrator {
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
        // вызываем метод регистрации пользователя
        this.registrateUser();
    }

    // метод регистрации пользователя
    registrateUser() {
        // тело запроса
        const body = this.body;

        // проверяем наличие необходимых полей в теле запроса
        // если у объекта переданы НЕ все поля
        if(new FieldsFinder(body, ["loginField", "passwordField"]).controleFields() === false) {
            // отсылаем ответ клиенту, что не все поля переданы
            new ResponseWriter("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем переданный логин
        const login = (body.loginField + "").toString();
        // сохраняем переданный пароль
        const password = (body.passwordField + "").toString();

        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что есть незаполненные поля
            new ResponseWriter("__EMPTY_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // проверяем длину полей
        // если логин или пароль имеют длину, которая больше 10-ти символов
        if(login.length > 10 || password.length > 10) {
            // отсылаем ответ клиенту, что поля слишком длинные
            new ResponseWriter("__LONG_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // проверяем содержимое полей
        // если поле логина или пароля содержат запретные символы
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

        // генерируем строку-запрос для отправки в СУБД
        // при этом пароль преобразуется в HASH строку
        const query = new StringGenerator("add_user", [login, new PasswordHashModifier(this.SHA256(password)).modifyIt()]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}