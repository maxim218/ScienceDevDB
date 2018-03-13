"use strict";

import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ResponseWriter from "../HelpingScripts/ResponseWriter";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

// класс - контроллер для сохранения и обновления 3D проекта
export default class Project3Dsaver {
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
        // вызываем метод сохранения и обновления 3D проекта
        this.saveOrLoad3Dproject();
    }

    // метод сохранения и обновления 3D проекта
    saveOrLoad3Dproject() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new FieldsFinder(body, ["loginField", "passwordField", "projectName", "projectContent"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new ResponseWriter("__NOT_ALL_FIELDS_GOT__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();
        // сохраняем имя проекта
        const projectName = (body.projectName + "").toString();
        // сохраняем содержимое проекта
        const projectContent = (body.projectContent + "").toString();

        // если логин пуст
        if(login === "") {
            // отправляем ответ, что логин пуст
            new ResponseWriter("__EMPTY_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если пароль пуст
        if(password === "") {
            // отправляем ответ, что пароль пуст
            new ResponseWriter("__EMPTY_PASSWORD__", this.response);
            // выходим из метода
            return;
        }

        // если имя проекта пусто
        if(projectName === "") {
            // отправляем ответ, что имя проекта пусто
            new ResponseWriter("__EMPTY_PROJECT_NAME__", this.response);
            // выходим из метода
            return;
        }

        // если содержимое проекта пусто
        if(projectContent === "") {
            // отправляем ответ, что содержимое проекта пусто
            new ResponseWriter("__EMPTY_PROJECT_CONTENT__", this.response);
            // выходим из метода
            return;
        }

        // если логин слишком длинный
        if(login.length > 10) {
            // отправляем ответ, что логин длинный
            new ResponseWriter("__LONG_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если имя проекта слишком длинное
        if(projectName.length > 10) {
            // отправляем ответ, что имя проекта слишком длинное
            new ResponseWriter("__LONG_PROJECT_NAME__", this.response);
            // выходим из метода
            return;
        }

        // если логин содержит запретные символы
        if(new ContentStringWatcher(login).normalString() === false) {
            // отправляем ответ, что в логине запретные символы
            new ResponseWriter("__BAD_CHARS_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если в пароле есть запретные символы
        if(new ContentStringWatcher(password).normalString() === false) {
            // отправляем ответ, что в пароле запретные символы
            new ResponseWriter("__BAD_CHARS_PASSWORD__", this.response);
            // выходим из метода
            return;
        }

        // если в имени проекта есть запретные символы
        if(new ContentStringWatcher(projectName).normalString() === false) {
            // отправляем ответ, что в имени проекта есть запретные символы
            new ResponseWriter("__BAD_CHARS_PROJECT_NAME__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем запрос к СУБД
        const query = new StringGenerator("save_update_three_project", [login, password, projectName, new StringCodeManager(projectContent).codeString()]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });

    }
}
