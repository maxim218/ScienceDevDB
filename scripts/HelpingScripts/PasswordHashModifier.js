"use strict";

import ContentStringWatcher from "./ContentStringWatcher";

// класс для замены запретных символов Hash строки пароля
export default class PasswordHashModifier {
    // конструктор
    constructor(passwordHash) {
        // инициализируем строку
        this.passwordHash = (passwordHash + "").toString();
    }

    // метод для замены запретных символов Hash строки пароля
    modifyIt() {
        // получаем Hash строку пароля и переводим её в верхний регистр
        const passwordHash = this.passwordHash.toUpperCase();
        // переменная для хранения изменённой строки
        let answer = "";
        // пробегаемся по всем символам в строке
        for(let i = 0; i < passwordHash.length; i++) {
            // получаем i-ый символ строки
            const c = passwordHash.charAt(i);
            // если данный символ является разрешённым
            if(ContentStringWatcher.normalChar(c) === true) {
                // добавляем символ в конец результирующей строки
                answer += c;
            } else {
                // если символ НЕ является разрешённым, то добавляем вместо него символ "A" в конец результирующей строки
                answer += "A";
            }
        }
        // добаляем к результирующей строке содержимое
        answer = "ABAB" + answer + "ABAB";
        // возвращаем строку, у которой все запретные символы заменены
        return answer;
    }
};
