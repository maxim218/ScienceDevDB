"use strict";

import ResponseWriter from "../HelpingScripts/ResponseWriter";
import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import QuerySender from "../HelpingScripts/QuerySender";
import StringGenerator from "../HelpingScripts/StringGenerator";

// класс-контроллер для удаления записи пользователя на его странице
export default class RecordDeleter {
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
        // вызываем метод для удаления одной записи пользователя
        this.deleteOneRecord();
    }

    // метод для удаления одной записи пользователя
    deleteOneRecord() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new FieldsFinder(body, ["loginField", "passwordField", "recordID"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new ResponseWriter("__NOT_ALL_FIELDS_WAS_FOUND__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();
        // сохраняем ID удаляемой записи
        const recordID = (body.recordID + "").toString();

        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что логин или пароль НЕ заполнены
            new ResponseWriter("__EMPTY_LOGIN_OR_PASSWORD_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // если содержимое поля ID записи пусто
        if(recordID === "") {
            // отправляем ответ клиенту, что содержимое поля ID записи пусто
            new ResponseWriter("__EMPTY_RECORD_ID__", this.response);
            // выходим из метода
            return;
        }

        // если логин имеет длину, которая больше 10-ти символов
        if(login.length > 10) {
            // отправляем ответ клиенту, что логин имеет слишком большую длину
            new ResponseWriter("__LONG_LOGIN_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // если логин или пароль содержат запретные символы
        if(new ContentStringWatcher(login).normalString() === false || new ContentStringWatcher(password).normalString() === false) {
            // отправляем ответ клиенту, что логин или пароль содержат запретные символы
            new ResponseWriter("__BAD_CHARS_FIELD_LOGIN_OR_PASSWORD_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // переводим ID записи в целое число
        let recordIdNumber = parseInt(recordID);
        // если ID записи не является целым числом
        if(recordIdNumber === undefined || recordIdNumber === null || isNaN(recordIdNumber) === true) {
            // отправляем ответ клиенту, что ID записи не является числом
            new ResponseWriter("__ID_NOT_NUMBER__", this.response);
            // выходим из метода
            return;
        }

        // если ID записи имеет слишком большое значение
        if(recordIdNumber > 922337203685477) {
            // отправляем ответ, что ID слишком большое
            new ResponseWriter("__RECORD_ID_VERY_BIG__", this.response);
            // выходим из метода
            return;
        }

        // если ID записи отрицательное
        if(recordIdNumber < 0) {
            // отправляем ответ клиенту, что ID отрицательное
            new ResponseWriter("__RECORD_ID_IS_OTRISATELN__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку для отправки запроса в СУБД
        const query = new StringGenerator("delete_one_record_of_user", [login, password, recordIdNumber]).generateQuery();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new ResponseWriter(answer, this.response);
        });
    }
}
