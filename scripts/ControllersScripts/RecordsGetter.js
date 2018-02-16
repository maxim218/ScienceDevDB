"use strict";

import ResponseWriter from "../HelpingScripts/ResponseWriter";
import FieldsFinder from "../HelpingScripts/FieldsFinder";
import ContentStringWatcher from "../HelpingScripts/ContentStringWatcher";
import StringGenerator from "../HelpingScripts/StringGenerator";
import QuerySender from "../HelpingScripts/QuerySender";
import StringCodeManager from "../HelpingScripts/StringCodeManager";

// класс-контроллер для получения записей на странице определённого пользователя
export default class RecordsGetter {
    // конструктор
    constructor(pg, body, response) {
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем тело POST-запроса
        this.body = body;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод получения записей определённого пользователя
        this.getRecords();
    }

    // метод для получения записей определённого пользователя
    getRecords() {
        // тело POST запроса
        const body = this.body;

        // если поле логина пользователя НЕ передано
        if(new FieldsFinder(body, ["loginField"]).controleFields() === false) {
            // отсылаем ответ клиенту, что поле логина НЕ передано
            new ResponseWriter("__FIELD_NOT_FOUND__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();

        // если логин пустой
        if(login === "") {
            // отправляем ответ клиенту, что поле логина пусто
            new ResponseWriter("__LOGIN_FIELD_EMPTY__", this.response);
            // выходим из метода
            return;
        }

        //  если длина логина превышает 10 символов
        if(login.length > 10) {
            // отправляем ответ клиенту, что длина логина слишком большая
            new ResponseWriter("__LONG_FIELD_VERY_LONG__", this.response);
            // выходим из метода
            return;
        }

        // если поле логина содержит запретные символы
        if(new ContentStringWatcher(login).normalString() === false) {
            // отправляем ответ клиенту, что логин содержит запретные символы
            new ResponseWriter("__BAD_CHARS_FIELD_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку запроса в СУБД
        const query = new StringGenerator("get_records_of_user", [login]).generateQueryNoAnswer();
        // отправляем запрос в СУБД
        new QuerySender(this.pg).makeQuery(query, res, () => {
            // получаем ответ от СУБД: массив объектов
            const mass = res.arr;
            // создаём результирующий массив
            const answer = [];

            // пробегаемся по всему массиву, полученному от СУБД
            for(let i = 0; i < mass.length; i++) {
                // получаем i-ый элемент массива
                const element = mass[i];
                // преобразуем текст записи пользователя в человекочитаемый вид
                const contentString = new StringCodeManager(element.record_content_t + "").decodeString();
                // добавляем информацию о записи пользователя в результирующий массив
                answer.push({
                    r_id: element.record_id_t,
                    m_id: element.man_id_t,
                    m_nn: element.man_nickname_t,
                    r_cc: contentString
                })
            }

            // отправляем ответ клиенту
            new ResponseWriter(JSON.stringify(answer), this.response);
        });
    }
}
