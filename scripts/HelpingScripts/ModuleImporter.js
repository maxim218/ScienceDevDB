"use strict";

// класс для импортирования библиотечных модулей
export default class ModuleImporter {
    // конструктор
    constructor(s) {
        // инициализируем имя модуля
        this.initModuleName(s);
    }

    // метод для инициализации имени модуля
    initModuleName(s) {
        // сохраняем имя поля
        this.moduleName = s.toString();
    }

    // метод для получения библиотечного модуля в виде объекта
    getModule() {
        // задаём строку, хранящую команду для импорта модуля
        const command = " require('" + this.moduleName + "'); ";
        // возвращаем объект
        return eval(command);
    }
}
