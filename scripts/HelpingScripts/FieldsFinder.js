"use strict";

// класс для проверки наличия определённых полей у объекта
export default class FieldsFinder {
    // конструктор
    constructor(obj, fieldsArray) {
        // инициализируем объект, у которого проверяется наличие полей
        this.obj = obj;
        // инициализируем массив полей, которые должны быть у объекта
        this.fieldsArray = fieldsArray;
    }

    // метод для проверки наличия полей у объекта
    controleFields() {
        // получаем объект
        const obj = this.obj;
        // получаем массив полей
        const fieldsArray = this.fieldsArray;
        // пробегаемся по всему массиву полей
        for(let i = 0; i < fieldsArray.length; i++) {
            // получаем название i-го поля
            const fieldName = fieldsArray[i].toString();
            // если поле НЕ существует
            if(obj[fieldName] === null || obj[fieldName] === undefined) {
                // говорим, что у объекта отсутствует необходимое поле
                return false;
            }
        }
        // если нас не выкинуло из цикла, объект имеет все необходимые поля
        return true;
    }
}
