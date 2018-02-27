"use strict";

import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import ResponseWriter from "../HelpingScripts/ResponseWriter";

// класс - контроллер для получения списка роликов определённого пользователя
export default class RolixListController {
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
        // вызываем метод для получения списка роликов определённого пользователя
        this.getRolixOfUser();
    }

    // метод для получения списка роликов определённого пользователя
    getRolixOfUser() {
        // тело запроса
        const body = this.body;

        // проверяем наличие необходимых полей в теле запроса
        // если у объекта нет поля логина
        if(new FieldsFinder(body, ["loginField"]).controleFields() === false) {
            // отсылаем ответ клиенту, что нет поля логина в теле запроса
            new ResponseWriter("__LOGIN_FIELD_NOT_FOUND__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем переданный логин
        const login = (body.loginField + "").toString();

        // если логин пустой
        if(login === "") {
            // отправляем ответ клиенту, что логин пустой
            new ResponseWriter("__EMPTY_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если логин длиннее 10-ти символов
        if(login.length > 10) {
            // отправляем ответ, что логин слишком длинный
            new ResponseWriter("__LONG_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если логин содержит запретные символы
        if(new ContentStringWatcher(login).normalString() === false) {
            // отправляем ответ клиенту, что логин содержит запретные символы
            new ResponseWriter("__BAD_CHARS_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // генерируем строку-запрос для отправки в СУБД
        const query = new StringGenerator("get_rolix_list", [login]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}
