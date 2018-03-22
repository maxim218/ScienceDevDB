"use strict";

import UrlManager from "./UrlManager";
import ResponseWriter from "../HelpingScripts/ResponseWriter";

// класс для получения запросов на сервер и проверки валидности url и тела запроса
export default class QueryGetter {
    // конструктор
    constructor(app) {
        // переменная для приёма GET и POST запросов
        this.app = app;
        // разрешаем получение GET запросов
        this.useGetQueries();
        // разрешаем получение POST запросов
        this.usePostQueries();
        // создаём экземпляр класса для роутинга
        this.urlManager = new UrlManager(this.app);
        // массив разрешённых операций, вызывающихся с помощью GET запросов
        this.allowedOperationsGet = [
            "about_server",
            "init_database",
            "users_list",
            "get_all_forums",
        ];
        // массив разрешённых операций, вызывающихся с помощью POST запросов
        this.allowedOperationsPost = [
            "registrate_user",
            "authorize_user",
            "add_record",
            "get_records",
            "drop_record",
            "auth_hash_user",
            "create_movie",
            "get_rolix_list",
            "get_rolic_by_login_and_name",
            "save_update_proj",
            "get_three_projects_of_user",
            "get_content_of_three_project_of_one_user",
            "add_forum",
            "add_message",
            "get_forum_messages",
        ];
    }

    // метод для вывода информации о полученном запросе на сервер
    static printInfo(type, request, response, operation, body) {
        // выводим на экран тип запроса (GET или POST)
        console.log("Method: " + type);
        // выводим на экран url запроса
        console.log("Url: " + request.url);
        // выводим на экран операцию (определённая часть url)
        console.log("Operation: " + operation);
        // если запрос типа POST, то у запроса есть тело
        if(type === "POST") {
            // выводим на экран тело запроса
            console.log("Body: " + body);
        }
    }

    // метод для получения операции по содержимому url
    static getOperation(url) {
        // берём url и разбиваем его по частям
        const mass = url.toString().split("/");
        // возвращаем операцию в виде строки
        return mass[1];
    }

    // метод для разрешения получения и обработки GET запросов
    useGetQueries() {
        // при получении GET запроса
        this.app.get('/*', (request, response) => {
            // получаем url
            const url = request.url;
            // получаем тип операции
            const operation = QueryGetter.getOperation(url);
            // выводим информацию о запросе
            QueryGetter.printInfo("GET", request, response, operation, null);
            // если операция НЕ является разрешённой для выполнения при её вызове с помощью GET запроса
            if(this.allowedOperationsGet.indexOf(operation) === -1) {
                // отсылаем клиенту ответ, что операция запрещена
                new ResponseWriter("__NOT_ALLOWED_OPERATION__", response);
            } else {
                // отдаём запрос на роутинг
                this.urlManager.routeQuery(request, response, operation, url, null);
            }
        });
    }

    // метод для разрешения получения и обработки POST запросов
    usePostQueries() {
        // при получении POST запроса
        this.app.post('/*', (request, response) => {
            // получаем url
            const url = request.url;
            // получаем тип операции
            const operation = QueryGetter.getOperation(url);
            // если операция НЕ является разрешённой для выполнения при её вызове с помощью POST запроса
            if(this.allowedOperationsPost.indexOf(operation) === -1) {
                // отсылаем клиенту ответ, что операция запрещена
                new ResponseWriter("__NOT_ALLOWED_OPERATION__", response);
            } else {
                // строка для хранения тела запроса
                let dataString = "";
                // при приходе части тела запроса
                request.on('data', (data) => {
                    // добавляем часть запроса в строку для хранения тела запроса
                    dataString += data;
                }).on('end', () => {
                    // при получении всего тела запроса
                    try {
                        // выводим информацию о запросе на экран
                        QueryGetter.printInfo("POST", request, response, operation, dataString);
                        // пытаемся преобразовать тело запроса в объект JSON
                        // если во время преобразования будет ошибка, то она отловится блоком try, после чего будет вызван блок catch
                        const body = JSON.parse(dataString);
                        // отдаём запрос на роутинг
                        this.urlManager.routeQuery(request, response, operation, url, body);
                    } catch (err) {
                        // если была отловлена ошибка
                        console.log("ERROR: " + err);
                        // отправляем сообщение об ошибке клиенту
                        new ResponseWriter("__JSON_ERROR__", response);
                    }
                });
            }
        });
    }
}

