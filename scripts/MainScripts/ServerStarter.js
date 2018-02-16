"use strict";

import ModuleImporter from "../HelpingScripts/ModuleImporter";
import QueryGetter from "./QueryGetter";

// класс для запуска сервера
class ServerStarter {
    // конструктор
    constructor(portNumber) {
        // подключаем модуль для работы с запросами на сервер
        let express = new ModuleImporter("express").getModule();
        // переменная для приёма GET и POST запросов
        this.app = express();
        // разрешаем обработку запросов от разных серверов
        this.allowQueries();
        // запускаем сервер на определённом порте
        this.startServer(portNumber);
        // создаём экземпляр класса для получения запросов на сервер и проверки валидности url и тела запроса
        this.queryGetter = new QueryGetter(this.app);
    }

    // метод для разрешения на обработку запросов от разных серверов
    allowQueries() {
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    // метод для запуска сервера
    startServer(portNumber) {
        // получаем порт, на котором будет запущен сервер
        const port = process.env.PORT || portNumber;
        // запускаем сервер на порте
        this.app.listen(port);
        // выводим на экран информацию об успешном запуске сервера
        console.log("------------------------------------------");
        console.log("Server works on port " + port);
        console.log("------------------------------------------");
    }
}

// создаём экземпляр класса для запуска сервера
const serverStarter = new ServerStarter(5000);
