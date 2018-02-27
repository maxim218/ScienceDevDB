"use strict";

import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ResponseWriter from "../HelpingScripts/ResponseWriter";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

// класс - контроллер для создания нового ролика
export default class MovieCreator {
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
        // вызываем метод создания нового ролика
        this.createNewMovie();
    }

    // метод для создания нового ролика
    createNewMovie() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new FieldsFinder(body, ["loginField", "passwordField", "movieName", "movieContent"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new ResponseWriter("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();
        // сохраняем имя ролика
        const movieName = (body.movieName + "").toString();
        // сохраняем содержимое ролика
        const movieContent = (body.movieContent + "").toString();

        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что логин или пароль НЕ заполнены
            new ResponseWriter("__EMPTY_LOGIN_OR_PASSWORD__", this.response);
            // выходим из метода
            return;
        }

        // если имя ролика НЕ заполнено
        if(movieName === "") {
            // отправляем ответ, что имя ролика пусто
            new ResponseWriter("__EMPTY_MOVIE_NAME__", this.response);
            // выходим из метода
            return;
        }

        // если содержимое ролика пусто
        if(movieContent === "") {
            // отправляем ответ, что содержимое ролика пусто
            new ResponseWriter("__EMPTY_MOVIE_CONTENT__", this.response);
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

        // если имя ролика длиннее 10-ти символов
        if(movieName.length > 10) {
            // отправляем ответ, что имя ролика слишком длинное
            new ResponseWriter("__LONG_MOVIE_NAME__", this.response);
            // выходим из метода
            return;
        }

        // если логин или пароль содержат запретные символы
        if(new ContentStringWatcher(login).normalString() === false || new ContentStringWatcher(password).normalString() === false) {
            // отправляем ответ клиенту, что логин или пароль содержат запретные символы
            new ResponseWriter("__BAD_CHARS_FIELD_LOGIN_OR_PASSWORD__", this.response);
            // выходим из метода
            return;
        }

        // если имя ролика содержит запретные символы
        if(new ContentStringWatcher(movieName).normalString() === false) {
            // отправляем ответ, что имя ролика имеет запретные символы
            new ResponseWriter("__BAD_CHARS_MOVIE_NAME__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем запрос к СУБД
        const query = new StringGenerator("create_or_update_movie", [login, password, movieName, new StringCodeManager(movieContent).codeString()]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}
