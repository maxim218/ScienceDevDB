"use strict";

import ResponseWriter from "../HelpingScripts/ResponseWriter";
import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";

// класс - контроллер для получения списка 3D проектов пользователя
export default class GetterThreeProjectsNames {
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
        // вызываем метод для получения списка 3D проектов пользователя
        this.listOfThreeProjectsOfTheUser();
    }

    // метод для получения списка 3D проектов пользователя
    listOfThreeProjectsOfTheUser() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие поля логина
        // если поле НЕ перадано
        if(new FieldsFinder(body, ["loginField"]).controleFields() === false) {
            // отправляем ответ клиенту, поле логина НЕ передано
            new ResponseWriter("__NOT_LOGIN_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();

        // если логин пустой
        if(login === "") {
            // отправляем ответ, что логин пустой
            new ResponseWriter("__EMPTY_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если логин длиннее 10-ти символов
        if(login.length > 10) {
            // отправляем ответ, что логин слишком длинный
            new ResponseWriter("__VERY_LONG_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если в логине есть запретные символы
        if(new ContentStringWatcher(login).normalString() === false) {
            // отправляем ответ, что в логине запретные символы
            new ResponseWriter("__BAD_CHARS_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку для отправки запроса в СУБД
        const query = new StringGenerator("get_three_projects", [login]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}
