"use strict";

// класс для отправки ответа клиентскому приложению
export default class ResponseWriter {
    // конструктор
    constructor(message, response) {
        // инициализируем содержимое ответа
        this.setMessage(message);
        // инициализируем объект, осуществляющий отправку заголовков и тела ответа клиенту
        this.setResponse(response);
        // отправляем ответ клиенту
        this.sendAnswerToClient();
    }

    // метод для инициализации текста ответа
    setMessage(message) {
        // сохраняем текст ответа
        this.messageContent = message.toString();
    }

    // метод для инициализации объекта, осуществляющего отправку заголовков и тела ответа клиенту
    setResponse(response) {
        // сохраняем объект
        this.response = response;
    }

    // метод для отправки ответа клиентскому приложению
    sendAnswerToClient() {
        // задаём код ответа 200 ОК
        this.response.status(200);
        // выводим на экран текст ответа
        console.log("Answer: " + this.messageContent);
        // выводим на экран строку для визуального разделения содержимого консоли
        console.log("------------------------------------------");
        // отправляем ответ клиентскому приложению
        this.response.end(this.messageContent);
    }
}
