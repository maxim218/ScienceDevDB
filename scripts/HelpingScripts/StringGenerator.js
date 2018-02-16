"use strict";

// класс для формирования SQL текста запроса в СУБД
export default class StringGenerator {
    // конструктор
    constructor(functionName, paramsArray) {
        // инициализируем имя plpgsql функции
        this.functionName = functionName;
        // инициализиуем массив параметров plpgsql функции
        this.paramsArray = paramsArray;
    }

    // метод для генерации запроса с добавлением alias
    generateQuery() {
        // задаём имя plpgsql функции
        const functionName = this.functionName;
        // задаём массив параметров plpgsql функции
        const paramsArray = this.paramsArray;
        // пробегаемся по массиву параметров
        for(let i = 0; i < paramsArray.length; i++) {
            // добавляем кавычки в начале и в конце содержимого параметра
            paramsArray[i] = "'" + paramsArray[i] + "'";
        }
        // формируем строку запроса к СУБД
        const queryString = " SELECT * FROM " + functionName + "(" + paramsArray.join(",") + ") AS answer; ";
        // выводим строку запроса на экран
        console.log("Query: " + queryString);
        // возвращаем строку запроса
        return queryString;
    }

    // метод для генерации запроса с без использования добавления alias
    generateQueryNoAnswer() {
        // задаём имя plpgsql функции
        const functionName = this.functionName;
        // задаём массив параметров plpgsql функции
        const paramsArray = this.paramsArray;
        // пробегаемся по массиву параметров
        for(let i = 0; i < paramsArray.length; i++) {
            // добавляем кавычки в начале и в конце содержимого параметра
            paramsArray[i] = "'" + paramsArray[i] + "'";
        }
        // формируем строку запроса к СУБД
        const queryString = " SELECT * FROM " + functionName + "(" + paramsArray.join(",") + "); ";
        // выводим строку запроса на экран
        console.log("Query: " + queryString);
        // возвращаем строку запроса
        return queryString;
    }
}
