"use strict";

import AboutServerController from "../ControllersScripts/AboutServerController";
import ModuleImporter from "../HelpingScripts/ModuleImporter";
import DataBaseIniter from "../ControllersScripts/DataBaseIniter";
import UserRegistrator from "../ControllersScripts/UserRegistrator";
import UserAuthorizer from "../ControllersScripts/UserAuthorizer";
import RecordAdder from "../ControllersScripts/RecordAdder";
import RecordsGetter from "../ControllersScripts/RecordsGetter";
import RecordDeleter from "../ControllersScripts/RecordDeleter";
import UsersListGetter from "../ControllersScripts/UsersListGetter";
import AuthUserByHash from "../ControllersScripts/AuthUserByHash";

// класс для реализации роутинга
export default class UrlManager {
    // конструктор
    constructor(app) {
        // переменная для получения GET и POST запросов
        this.app = app;
        // подключаем модуль для взаимодействия с СУБД
        this.pg = new ModuleImporter("pg").getModule();
        // подключаем модуль для получения HASH от паролей
        this.SHA256 = new ModuleImporter("crypto-js/sha256").getModule();
        // подключаем модуль для взаимодействия с файловой системой
        this.fs = new ModuleImporter("fs").getModule();
    }

    // метод для реализации вызова действий определённых контроллеров в зависимости от переданной операции
    routeQuery(request, response, operation, url, body) {
        // операция на получение информации о сервере
        if(operation === "about_server") {
            // создаём контроллер для получения информации о сервере
            new AboutServerController(response);
            // выходим из метода
            return;
        }

        // операция на инициализацию таблиц БД и инициализацию plpgsql функций
        if(operation === "init_database") {
            // создаём контроллер для инициализации БД
            new DataBaseIniter(this.fs, this.pg, response);
            // выходим из метода
            return;
        }

        // операция на регистрацию пользователя
        if(operation === "registrate_user") {
            // создаём контроллер для регистрации пользователя
            new UserRegistrator(this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }

        // операция на авторизацию пользователя
        if(operation === "authorize_user") {
            // создаём контроллер для авторизации пользователя
            new UserAuthorizer(this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }

        // операция на добавление записи на страницу пользователя
        if(operation === "add_record") {
            // создаём контроллер для добавления записи на страницу пользователя
            new RecordAdder(this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }

        // операция на получение записей на странице пользователя
        if(operation === "get_records") {
            // создаём контроллер для получения записей на странице пользователя
            new RecordsGetter(this.pg, body, response);
            // выходим из метода
            return;
        }

        // операция на удаление записей со страницы пользователя
        if(operation === "drop_record") {
            // создаём контроллер для удаления записи пользователя
            new RecordDeleter(this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }

        // операция на получение массива пользователей
        if(operation === "users_list") {
            // создаём контроллер для получения массива пользователей
            new UsersListGetter(this.pg, response);
            // выходим из метода
            return;
        }

        // операция на авторизацию пользователя по логину и hash от пароля
        if(operation === "auth_hash_user") {
            // создаём контроллер для авторизации пользователя по логину и hash от пароля
            new AuthUserByHash(this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }
    }
}
