"use strict";

import ResponseWriter from "../HelpingScripts/ResponseWriter";
import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

// класс - контроллер для получения ролика по логину пользователя и имени ролика
export default class OneRolicGetter {
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
        // вызываем метод получения ролика по логину пользователя и имени ролика
        this.getRolicByLoginAndName();
    }

    // метод для получения ролика по логину пользователя и имени ролика
    getRolicByLoginAndName() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new FieldsFinder(body, ["loginField", "movieField"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new ResponseWriter("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем имя ролика
        const movie = (body.movieField + "").toString();

        // если логин или имя ролика пустые
        if(login === "" || movie === "") {
            // отправляем ответ, что логин или имя ролика пустые
            new ResponseWriter("__EMPTY_LOGIN_OR_MOVIE__", this.response);
            // выходим из метода
            return;
        }

        // если логин или имя ролика имеют длину, которая больше 10-ти символов
        if(login.length > 10 || movie.length > 10) {
            // отправляем ответ клиенту, что логин или имя ролика слишком длинные
            new ResponseWriter("__LONG_MOVIE_OR_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если логин или имя ролика содержат запретные символы
        if(new ContentStringWatcher(login).normalString() === false || new ContentStringWatcher(movie).normalString() === false) {
            // отправляем ответ клиенту, что логин или имя ролика содержат запретные символы
            new ResponseWriter("__BAD_CHARS_LOGIN_OR_MOVIE__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку для отправки запроса в СУБД
        const query = new StringGenerator("get_one_rolic_by_login_and_name", [login, movie]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            let answer = res.arr[0].answer.toString();
            // если ролик не найден
            if(answer === "_NOT_FOUND_") {
                // отправляем ответ клиенту, что ролик НЕ найден
                new ResponseWriter(answer, this.response);
                // выходим из метода
                return;
            } else {
                // если ролик найден
                // преобразуем строку
                answer = new StringCodeManager(answer).decodeString() + "";
                // отправляем ответ клиенту
                new ResponseWriter(answer, this.response);
                // выходим из метода
                return;
            }
        });
    }
}
