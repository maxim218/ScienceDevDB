"use strict";

// класс для отправки запросов в СУБД и получения ответа
export default class QuerySender {
    // конструктор
    constructor(pg) {
        // инициализируем модуль для взаимодействия с СУБД
        this.pg = pg;
    }

    // метод для создания клиента, реализующего подключение к СУБД
    createNewClient() {
        // получаем модуль для взаимодействия с СУБД
        const pg = this.pg;
        // создаём и возвращаем нового клиента, реализующего подключение к СУБД
        return new pg.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'sciencedevdb',
            password: '123',
            port: 5432
        });
    }

    // метод для отправки запроса в СУБД и получения ответа от СУБД
    makeQuery(query, resultObj, callback) {
        // создаём нового клиента для подключения к СУБ
        const client = this.createNewClient();
        // подключаемся к СУБД
        client.connect();
        // отправляем запрос в СУБД
        client.query(query, (err, res) => {
            // если во время работы СУБД произошла ошибка
            if(err !== null && err !== undefined) {
                // выводим ошибку в консоль
                console.log(err);
            }
            // сохраняем ответ от СУБД в массив
            resultObj.arr = res.rows;
            // закрываем соединение с СУБД
            client.end();
            // вызываем функцию JavaScript, переданную в качестве параметра
            callback();
        });
    }
}
