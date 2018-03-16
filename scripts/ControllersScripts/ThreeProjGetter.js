"use strict";

import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ResponseWriter from "../HelpingScripts/ResponseWriter";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

// класс - контроллер для получения содержимого 3D проекта пользователя
export default class ThreeProjGetter {
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
        // вызываем метод для получения содержимого 3D проекта пользователя
        this.getContentofUser3DProject();
    }

    // метод для получения содержимого 3D проекта пользователя
    getContentofUser3DProject() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new FieldsFinder(body, ["loginField", "projectField"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new ResponseWriter("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем название проекта
        const project = (body.projectField + "").toString();

        // если логин пустой
        if(login === "") {
            // отправляем ответ клиенту, что логин пуст
            new ResponseWriter("__EMPTY_LOGIN_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // если название проекта пустое
        if(project === "") {
            // отправляем ответ клиенту, что название проекта пустое
            new ResponseWriter("__EMPTY_PROJECT_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // если логин длиннее 10-ти символов
        if(login.length > 10) {
            // отправляем ответ клиенту, что логин слишком длинный
            new ResponseWriter("__VERY_LONG_LOGIN__", this.response);
            // выходм из метода
            return;
        }

        // если название проекта длиннее 10-ти символов
        if(project.length > 10) {
            // отправляем ответ клиенту, что название проекта слишком длинное
            new ResponseWriter("__VERY_LONG_PROJECT__", this.response);
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

        // если название проекта содержит запретные символы
        if(new ContentStringWatcher(project).normalString() === false) {
            // отправляем ответ клиенту, что название проекта содержит запретные символы
            new ResponseWriter("__BAD_CHARS_PROJECT__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем запрос к СУБД
        const query = new StringGenerator("get_one_three_project_of_user", [project, login]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // если проект НЕ найден
            if(answer === "__PROJECT_3D_NOT_FOUND__") {
                // отправляем ответ клиенту, что проект не найден
                new ResponseWriter(answer, this.response);
                // выходим из метода
                return;
            } else {
                // если проект найден
                // переводим его в стандартный вид
                const answerRes = new StringCodeManager(answer).decodeString() + "";
                // отправляем ответ клиенту
                new ResponseWriter(answerRes, this.response);
                // выходим из метода
                return;
            }
        });
    }
}
