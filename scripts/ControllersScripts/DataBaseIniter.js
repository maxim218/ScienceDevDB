"use strict";

import QuerySender from "../HelpingScripts/QuerySender";
import ResponseWriter from "../HelpingScripts/ResponseWriter";

// класс-контроллер для инициализации БД
export default class DataBaseIniter {
    // конструктор
    constructor(fs, pg, response) {
        // инициализируем объект для взаимодействия с файловой системой
        this.fs = fs;
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод, который считывает содержимое файла SQL и отправляет его содержимое в СУБД
        this.readSqlFromFileAndInitDB();
    }

    // метод, реализующий считывание содержимого файла SQL и отправку содержимого файла в СУБД
    readSqlFromFileAndInitDB() {
        // объект для взаимодействия с файловой системой
        const fs = this.fs;
        // объект для взаимодействия с СУБД
        const pg = this.pg;
        // объект для отправки ответа клиенту
        const response = this.response;
        // считываем содержимое файла "database.sql"
        fs.readFile("database.sql", function(err, data) {
            // сохраняем содержимое файла в строку
            const content = data.toString();
            // отправляем содержимое файла в СУБД
            new QuerySender(pg).makeQuery(content, {}, () => {
                // отправляем ответ клиенту
                new ResponseWriter("__INIT_DATABASE_OK__", response);
            });
        });
    }
}
