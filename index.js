/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для отправки ответа клиентскому приложению
class ResponseWriter {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = ResponseWriter;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для отправки запросов в СУБД и получения ответа
class QuerySender {
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
        // создаём нового клиента для подключения к СУБД
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
/* harmony export (immutable) */ __webpack_exports__["a"] = QuerySender;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для проверки того, что строка состоит только из символов:  0-9, a-z, A-Z
class ContentStringWatcher {
    // конструктор
    constructor(s) {
        // инициализируем строку
        this.s = s;
    }

    // метод для проверки того, что символ входит в множество символов:  0-9, a-z, A-Z
    static normalChar(charParam) {
        // переводим символ в нижний регистр
        const c = charParam.toLowerCase();
        // задаём множество разрешённых для использования символов в виде строки
        // большие буквы не вошли в данную строку, так как проверяемый символ заранее переведён в нижний регистр
        const allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789";
        // возвращает True, если символ входит в строку разрешённых символов
        return allowedChars.indexOf(c) !== -1;
    }

    // метод для проверки того, что абсолютно все символы строки входят в множество символов:  0-9, a-z, A-Z
    normalString() {
        // получаем строку
        const s = this.s;
        // проходимся по всем символам строки
        for(let i = 0; i < s.length; i++) {
            // получаем i-ый символ строки
            const c = s.charAt(i);
            // если символ НЕ является разрешённым
            if(ContentStringWatcher.normalChar(c) === false) {
                // говорим, что строка некорректна
                return false;
            }
        }
        // если нас не выкинуло из цикла, строка является корректной
        return true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ContentStringWatcher;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для формирования SQL текста запроса в СУБД
class StringGenerator {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = StringGenerator;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для проверки наличия определённых полей у объекта
class FieldsFinder {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = FieldsFinder;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для преобразования срок с целью ликвидации риска SQL инъекций
class StringCodeManager {
    // конструктор
    constructor(stringParam) {
        // инициализируем сроку
        this.s = (stringParam + "").toString();
    }

    // метод для получения кода символа в виде числа
    static getNumberOfChar(c) {
        // возвращаем код символа, переданного в качестве параметра метода
        return c.charCodeAt(0);
    }

    // метод для преобразования строки в форму, пригодную для взаимодействия с SQL
    codeString() {
        // получаем строку
        const s = this.s;
        // создаём массив для хранения кодов символов
        const mass = [];
        // пробегаемся по всем символам строки
        for(let i = 0; i < s.length; i++) {
            // получаем i-ый символ строки
            const c = s.charAt(i);
            // получаем код символа
            const n = StringCodeManager.getNumberOfChar(c);
            // добавляем код символа в конец массива
            mass.push(n);
        }
        // преобразуем массив кодов символов в строку и возвращаем её
        return mass.join("_");
    }

    // метод для преобразования строки из формы, пригодной для взаимодействия с SQL, в человекочитаемый вид
    decodeString() {
        // получаем строку
        const s = (this.s + "").toString();
        // разбиваем строку на элементы и получаем массив кодов символов
        const mass = s.split("_");
        // инициализируем переменную для хранения результирующей строки
        let answer = "";
        // пробегаемся по всему массиву кодов символов
        for(let i = 0; i < mass.length; i++) {
            // получаем i-ый код символа
            const n = mass[i];
            // преобразуем код символа в символ и добавляем полученный символ в конец результирующей строки
            answer += String.fromCharCode(n);
        }
        // возвращаем результирующую строку
        return answer;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StringCodeManager;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


// класс для импортирования библиотечных модулей
class ModuleImporter {
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
/* harmony export (immutable) */ __webpack_exports__["a"] = ModuleImporter;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ContentStringWatcher__ = __webpack_require__(2);




// класс для замены запретных символов Hash строки пароля
class PasswordHashModifier {
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
            if(__WEBPACK_IMPORTED_MODULE_0__ContentStringWatcher__["a" /* default */].normalChar(c) === true) {
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
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PasswordHashModifier;
;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ModuleImporter__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__QueryGetter__ = __webpack_require__(10);





// класс для запуска сервера
class ServerStarter {
    // конструктор
    constructor(portNumber) {
        // подключаем модуль для работы с запросами на сервер
        let express = new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ModuleImporter__["a" /* default */]("express").getModule();
        // переменная для приёма GET и POST запросов
        this.app = express();
        // разрешаем обработку запросов от разных серверов
        this.allowQueries();
        // запускаем сервер на определённом порте
        this.startServer(portNumber);
        // создаём экземпляр класса для получения запросов на сервер и проверки валидности url и тела запроса
        this.queryGetter = new __WEBPACK_IMPORTED_MODULE_1__QueryGetter__["a" /* default */](this.app);
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

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(9)))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UrlManager__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__ = __webpack_require__(0);





// класс для получения запросов на сервер и проверки валидности url и тела запроса
class QueryGetter {
    // конструктор
    constructor(app) {
        // переменная для приёма GET и POST запросов
        this.app = app;
        // разрешаем получение GET запросов
        this.useGetQueries();
        // разрешаем получение POST запросов
        this.usePostQueries();
        // создаём экземпляр класса для роутинга
        this.urlManager = new __WEBPACK_IMPORTED_MODULE_0__UrlManager__["a" /* default */](this.app);
        // массив разрешённых операций, вызывающихся с помощью GET запросов
        this.allowedOperationsGet = [
            "about_server",
            "init_database",
            "users_list",
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
                new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALLOWED_OPERATION__", response);
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
                new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALLOWED_OPERATION__", response);
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
                        new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__JSON_ERROR__", response);
                    }
                });
            }
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QueryGetter;




/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ControllersScripts_AboutServerController__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ModuleImporter__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ControllersScripts_DataBaseIniter__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ControllersScripts_UserRegistrator__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ControllersScripts_UserAuthorizer__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ControllersScripts_RecordAdder__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ControllersScripts_RecordsGetter__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ControllersScripts_RecordDeleter__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ControllersScripts_UsersListGetter__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ControllersScripts_AuthUserByHash__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ControllersScripts_MovieCreator__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ControllersScripts_RolixListController__ = __webpack_require__(22);















// класс для реализации роутинга
class UrlManager {
    // конструктор
    constructor(app) {
        // переменная для получения GET и POST запросов
        this.app = app;
        // подключаем модуль для взаимодействия с СУБД
        this.pg = new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ModuleImporter__["a" /* default */]("pg").getModule();
        // подключаем модуль для получения HASH от паролей
        this.SHA256 = new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ModuleImporter__["a" /* default */]("crypto-js/sha256").getModule();
        // подключаем модуль для взаимодействия с файловой системой
        this.fs = new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ModuleImporter__["a" /* default */]("fs").getModule();
    }

    // метод для реализации вызова действий определённых контроллеров в зависимости от переданной операции
    routeQuery(request, response, operation, url, body) {
        // операция на получение информации о сервере
        if(operation === "about_server") {
            // создаём контроллер для получения информации о сервере
            new __WEBPACK_IMPORTED_MODULE_0__ControllersScripts_AboutServerController__["a" /* default */](response);
            // выходим из метода
            return;
        }

        // операция на инициализацию таблиц БД и инициализацию plpgsql функций
        if(operation === "init_database") {
            // создаём контроллер для инициализации БД
            new __WEBPACK_IMPORTED_MODULE_2__ControllersScripts_DataBaseIniter__["a" /* default */](this.fs, this.pg, response);
            // выходим из метода
            return;
        }

        // операция на регистрацию пользователя
        if(operation === "registrate_user") {
            // создаём контроллер для регистрации пользователя
            new __WEBPACK_IMPORTED_MODULE_3__ControllersScripts_UserRegistrator__["a" /* default */](this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }

        // операция на авторизацию пользователя
        if(operation === "authorize_user") {
            // создаём контроллер для авторизации пользователя
            new __WEBPACK_IMPORTED_MODULE_4__ControllersScripts_UserAuthorizer__["a" /* default */](this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }

        // операция на добавление записи на страницу пользователя
        if(operation === "add_record") {
            // создаём контроллер для добавления записи на страницу пользователя
            new __WEBPACK_IMPORTED_MODULE_5__ControllersScripts_RecordAdder__["a" /* default */](this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }

        // операция на получение записей на странице пользователя
        if(operation === "get_records") {
            // создаём контроллер для получения записей на странице пользователя
            new __WEBPACK_IMPORTED_MODULE_6__ControllersScripts_RecordsGetter__["a" /* default */](this.pg, body, response);
            // выходим из метода
            return;
        }

        // операция на удаление записей со страницы пользователя
        if(operation === "drop_record") {
            // создаём контроллер для удаления записи пользователя
            new __WEBPACK_IMPORTED_MODULE_7__ControllersScripts_RecordDeleter__["a" /* default */](this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }

        // операция на получение массива пользователей
        if(operation === "users_list") {
            // создаём контроллер для получения массива пользователей
            new __WEBPACK_IMPORTED_MODULE_8__ControllersScripts_UsersListGetter__["a" /* default */](this.pg, response);
            // выходим из метода
            return;
        }

        // операция на авторизацию пользователя по логину и hash от пароля
        if(operation === "auth_hash_user") {
            // создаём контроллер для авторизации пользователя по логину и hash от пароля
            new __WEBPACK_IMPORTED_MODULE_9__ControllersScripts_AuthUserByHash__["a" /* default */](this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }

        // операция создания ролика
        if(operation === "create_movie") {
            // создаём контроллер для создания ролика
            new __WEBPACK_IMPORTED_MODULE_10__ControllersScripts_MovieCreator__["a" /* default */](this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }

        // операция получения списка роликов пользователя
        if(operation === "get_rolix_list") {
            // создаём контроллер для получения списка роликов пользователя
            new __WEBPACK_IMPORTED_MODULE_11__ControllersScripts_RolixListController__["a" /* default */](this.pg, body, this.SHA256, response);
            // выходим из метода
            return;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UrlManager;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__ = __webpack_require__(0);




// класс-контроллер для получения информации о сервере
class AboutServerController {
    // конструктор
    constructor(response) {
        // задаём текст сообщения с информацией
        const answer = "__DATABASE_SERVER_CREATED_BY_KOLOTOVKIN_MAXIM__";
        // отправляем информацию о сервере клиенту
        new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */](answer, response);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AboutServerController;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__ = __webpack_require__(0);





// класс-контроллер для инициализации БД
class DataBaseIniter {
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
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_QuerySender__["a" /* default */](pg).makeQuery(content, {}, () => {
                // отправляем ответ клиенту
                new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__INIT_DATABASE_OK__", response);
            });
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DataBaseIniter;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_FieldsFinder__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_StringGenerator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_PasswordHashModifier__ = __webpack_require__(7);









// класс-контроллер для регистрации пользователя
class UserRegistrator {
    // конструктор
    constructor(pg, body, SHA256, response) {
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем тело POST запроса
        this.body = body;
        // инициализируем объект для получения HASH от пароля
        this.SHA256 = SHA256;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод регистрации пользователя
        this.registrateUser();
    }

    // метод регистрации пользователя
    registrateUser() {
        // тело запроса
        const body = this.body;

        // проверяем наличие необходимых полей в теле запроса
        // если у объекта переданы НЕ все поля
        if(new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField", "passwordField"]).controleFields() === false) {
            // отсылаем ответ клиенту, что не все поля переданы
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем переданный логин
        const login = (body.loginField + "").toString();
        // сохраняем переданный пароль
        const password = (body.passwordField + "").toString();

        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что есть незаполненные поля
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // проверяем длину полей
        // если логин или пароль имеют длину, которая больше 10-ти символов
        if(login.length > 10 || password.length > 10) {
            // отсылаем ответ клиенту, что поля слишком длинные
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // проверяем содержимое полей
        // если поле логина или пароля содержат запретные символы
        if(new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false || new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ContentStringWatcher__["a" /* default */](password).normalString() === false) {
            // отправляем ответ клиенту, что поля содержат запретные символы
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // генерируем строку-запрос для отправки в СУБД
        // при этом пароль преобразуется в HASH строку
        const query = new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_StringGenerator__["a" /* default */]("add_user", [login, new __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_PasswordHashModifier__["a" /* default */](this.SHA256(password)).modifyIt()]).generateQuery();
        // отправляем запрос в СУБД
        new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */](answer, this.response);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UserRegistrator;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_PasswordHashModifier__ = __webpack_require__(7);









// класс-контроллер для авторизации пользователя
class UserAuthorizer {
    // конструктор
    constructor(pg, body, SHA256, response) {
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем тело POST запроса
        this.body = body;
        // инициализируем объект для получения HASH от пароля
        this.SHA256 = SHA256;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод авторизации пользователя
        this.authorizeUser();
    }

    // метод для авторизации пользователя
    authorizeUser() {
        // получаем тело POST запроса
        const body = this.body;

        // проверяем наличие необходимых полей в теле запроса
        // если НЕ все необходимые поля переданы
        if(new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField", "passwordField"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();

        // проверяем логин и пароль на пустоту
        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что имеются незаполненные поля
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // проверяем логин и пароль на длину
        // если логин или пароль имеют длину, которая больше 10-ти символов
        if(login.length > 10 || password.length > 10) {
            // отправляем ответ, что поля имеют слишком большую длину
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // проверяем поля на наличие запретных символов
        // если логин или пароль содержат запретные символы
        if(new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false || new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](password).normalString() === false) {
            // отправляем ответ клиенту, что поля содержат запретные символы
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку для отправки запроса в СУБД
        // при этом пароль преобразуется в HASH строку
        const query = new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__["a" /* default */]("normal_login_password", [login, new __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_PasswordHashModifier__["a" /* default */](this.SHA256(password)).modifyIt()]).generateQuery();
        // отправляем запрос в СУБД
        new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            // сохраняем ответ от СУБД в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */](answer, this.response);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UserAuthorizer;



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_StringCodeManager__ = __webpack_require__(5);









// класс-контроллер для добавление записей на страницу пользователя
class RecordAdder {
    // конструктор
    constructor(pg, body, SHA256, response) {
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем тело POST запроса
        this.body = body;
        // инициализируем объект для получения HASH от пароля
        this.SHA256 = SHA256;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод для добавления записи на страницу пользователя
        this.addRecord();
    }

    // метод для добавления записи на страницу пользователя
    addRecord() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField", "passwordField", "contentField"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();
        // сохраняем текст записи
        const content = (body.contentField + "").toString();

        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что логин или пароль НЕ заполнены
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_LOGIN_OR_PASSWORD__", this.response);
            // выходим из метода
            return;
        }

        // если содержимое текста записи пусто
        if(content === "") {
            // отправляем ответ клиенту, что содержимое текста записи пусто
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_CONTENT__", this.response);
            // выходим из метода
            return;
        }

        // если логин имеет длину, которая больше 10-ти символов
        if(login.length > 10) {
            // отправляем ответ клиенту, что логин имеет слишком большую длину
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если логин или пароль содержат запретные символы
        if(new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false || new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](password).normalString() === false) {
            // отправляем ответ клиенту, что логин или пароль содержат запретные символы
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_FIELD_LOGIN_OR_PASSWORD__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку для отправки запроса в СУБД
        // при этом текст добавляемой записи преобразуется в специальный формат
        const query = new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__["a" /* default */]("add_record", [login, password, new __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_StringCodeManager__["a" /* default */](content).codeString()]).generateQuery();
        // отправляем запрос в СУБД
        new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */](answer, this.response);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RecordAdder;



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_StringCodeManager__ = __webpack_require__(5);









// класс-контроллер для получения записей на странице определённого пользователя
class RecordsGetter {
    // конструктор
    constructor(pg, body, response) {
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем тело POST-запроса
        this.body = body;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод получения записей определённого пользователя
        this.getRecords();
    }

    // метод для получения записей определённого пользователя
    getRecords() {
        // тело POST запроса
        const body = this.body;

        // если поле логина пользователя НЕ передано
        if(new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField"]).controleFields() === false) {
            // отсылаем ответ клиенту, что поле логина НЕ передано
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__FIELD_NOT_FOUND__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();

        // если логин пустой
        if(login === "") {
            // отправляем ответ клиенту, что поле логина пусто
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__LOGIN_FIELD_EMPTY__", this.response);
            // выходим из метода
            return;
        }

        //  если длина логина превышает 10 символов
        if(login.length > 10) {
            // отправляем ответ клиенту, что длина логина слишком большая
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_FIELD_VERY_LONG__", this.response);
            // выходим из метода
            return;
        }

        // если поле логина содержит запретные символы
        if(new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false) {
            // отправляем ответ клиенту, что логин содержит запретные символы
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_FIELD_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку запроса в СУБД
        const query = new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__["a" /* default */]("get_records_of_user", [login]).generateQueryNoAnswer();
        // отправляем запрос в СУБД
        new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            // получаем ответ от СУБД: массив объектов
            const mass = res.arr;
            // создаём результирующий массив
            const answer = [];

            // пробегаемся по всему массиву, полученному от СУБД
            for(let i = 0; i < mass.length; i++) {
                // получаем i-ый элемент массива
                const element = mass[i];
                // преобразуем текст записи пользователя в человекочитаемый вид
                const contentString = new __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_StringCodeManager__["a" /* default */](element.record_content_t + "").decodeString();
                // добавляем информацию о записи пользователя в результирующий массив
                answer.push({
                    r_id: element.record_id_t,
                    m_id: element.man_id_t,
                    m_nn: element.man_nickname_t,
                    r_cc: contentString
                })
            }

            // отправляем ответ клиенту
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */](JSON.stringify(answer), this.response);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RecordsGetter;



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_StringGenerator__ = __webpack_require__(3);








// класс-контроллер для удаления записи пользователя на его странице
class RecordDeleter {
    // конструктор
    constructor(pg, body, SHA256, response) {
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем тело POST запроса
        this.body = body;
        // инициализируем объект для получения HASH от пароля
        this.SHA256 = SHA256;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод для удаления одной записи пользователя
        this.deleteOneRecord();
    }

    // метод для удаления одной записи пользователя
    deleteOneRecord() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField", "passwordField", "recordID"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALL_FIELDS_WAS_FOUND__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();
        // сохраняем ID удаляемой записи
        const recordID = (body.recordID + "").toString();

        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что логин или пароль НЕ заполнены
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_LOGIN_OR_PASSWORD_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // если содержимое поля ID записи пусто
        if(recordID === "") {
            // отправляем ответ клиенту, что содержимое поля ID записи пусто
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_RECORD_ID__", this.response);
            // выходим из метода
            return;
        }

        // если логин имеет длину, которая больше 10-ти символов
        if(login.length > 10) {
            // отправляем ответ клиенту, что логин имеет слишком большую длину
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_LOGIN_FIELD__", this.response);
            // выходим из метода
            return;
        }

        // если логин или пароль содержат запретные символы
        if(new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false || new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](password).normalString() === false) {
            // отправляем ответ клиенту, что логин или пароль содержат запретные символы
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_FIELD_LOGIN_OR_PASSWORD_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // переводим ID записи в целое число
        let recordIdNumber = parseInt(recordID);
        // если ID записи не является целым числом
        if(recordIdNumber === undefined || recordIdNumber === null || isNaN(recordIdNumber) === true) {
            // отправляем ответ клиенту, что ID записи не является числом
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__ID_NOT_NUMBER__", this.response);
            // выходим из метода
            return;
        }

        // если ID записи имеет слишком большое значение
        if(recordIdNumber > 922337203685477) {
            // отправляем ответ, что ID слишком большое
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__RECORD_ID_VERY_BIG__", this.response);
            // выходим из метода
            return;
        }

        // если ID записи отрицательное
        if(recordIdNumber < 0) {
            // отправляем ответ клиенту, что ID отрицательное
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__RECORD_ID_IS_OTRISATELN__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку для отправки запроса в СУБД
        const query = new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_StringGenerator__["a" /* default */]("delete_one_record_of_user", [login, password, recordIdNumber]).generateQuery();
        // отправляем запрос в СУБД
        new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */](answer, this.response);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RecordDeleter;



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_StringGenerator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ResponseWriter__ = __webpack_require__(0);






// класс - контроллер для получения массива пользователей
class UsersListGetter {
    // конструктор
    constructor(pg, response) {
        // объект для работы с СУБД
        this.pg = pg;
        // объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод для получения массива пользователей
        this.getListOfUsers();
    }

    // метод для получения массива пользователей
    getListOfUsers() {
        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку запроса в СУБД
        const query = new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_StringGenerator__["a" /* default */]("get_users_list", []).generateQuery();
        // отправляем запрос в СУБД
        new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ResponseWriter__["a" /* default */](answer, this.response);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UsersListGetter;



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_FieldsFinder__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__ = __webpack_require__(1);








// класс - контроллер для авторизации пользователя по его логину и Hash от пароля
class AuthUserByHash {
    // конструктор
    constructor(pg, body, SHA256, response) {
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем тело POST запроса
        this.body = body;
        // инициализируем объект для получения HASH от пароля
        this.SHA256 = SHA256;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод авторизации пользователя по его логину и Hash от пароля
        this.authUserByHisPasswordHash();
    }

    // метод авторизации пользователя по логину и HASH от пароля
    authUserByHisPasswordHash() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField", "passwordField"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALL_FIELDS_SENT__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();

        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что логин или пароль НЕ заполнены
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__LOGIN_OR_PASSWORD_ARE_EMPTY__", this.response);
            // выходим из метода
            return;
        }

        // если логин имеет длину, которая больше 10-ти символов
        if(login.length > 10) {
            // отправляем ответ клиенту, что логин имеет слишком большую длину
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если логин или пароль содержат запретные символы
        if(new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false || new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](password).normalString() === false) {
            // отправляем ответ клиенту, что логин или пароль содержат запретные символы
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_LOGIN_OR_PASSWORD_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем строку для отправки запроса в СУБД
        const query = new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__["a" /* default */]("normal_login_password", [login, password]).generateQuery();
        // отправляем запрос в СУБД
        new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */](answer, this.response);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AuthUserByHash;



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_FieldsFinder__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_StringCodeManager__ = __webpack_require__(5);









// класс - контроллер для создания нового ролика
class MovieCreator {
    // конструктор
    constructor(pg, body, SHA256, response) {
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем тело POST запроса
        this.body = body;
        // инициализируем объект для получения HASH от пароля
        this.SHA256 = SHA256;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод создания нового ролика
        this.createNewMovie();
    }

    // метод для создания нового ролика
    createNewMovie() {
        // задаём тело POST запроса
        const body = this.body;

        // проверяем наличие всех необходимых полей
        // если НЕ все необходимые поля переданы
        if(new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField", "passwordField", "movieName", "movieContent"]).controleFields() === false) {
            // отправляем ответ клиенту, что не все поля переданы
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALL_FIELDS__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем логин
        const login = (body.loginField + "").toString();
        // сохраняем пароль
        const password = (body.passwordField + "").toString();
        // сохраняем имя ролика
        const movieName = (body.movieName + "").toString();
        // сохраняем содержимое ролика
        const movieContent = (body.movieContent + "").toString();

        // если логин или пароль пустые
        if(login === "" || password === "") {
            // отправляем ответ клиенту, что логин или пароль НЕ заполнены
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_LOGIN_OR_PASSWORD__", this.response);
            // выходим из метода
            return;
        }

        // если имя ролика НЕ заполнено
        if(movieName === "") {
            // отправляем ответ, что имя ролика пусто
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_MOVIE_NAME__", this.response);
            // выходим из метода
            return;
        }

        // если содержимое ролика пусто
        if(movieContent === "") {
            // отправляем ответ, что содержимое ролика пусто
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_MOVIE_CONTENT__", this.response);
            // выходим из метода
            return;
        }

        // если логин имеет длину, которая больше 10-ти символов
        if(login.length > 10) {
            // отправляем ответ клиенту, что логин имеет слишком большую длину
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если имя ролика длиннее 10-ти символов
        if(movieName.length > 10) {
            // отправляем ответ, что имя ролика слишком длинное
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_MOVIE_NAME__", this.response);
            // выходим из метода
            return;
        }

        // если логин или пароль содержат запретные символы
        if(new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false || new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](password).normalString() === false) {
            // отправляем ответ клиенту, что логин или пароль содержат запретные символы
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_FIELD_LOGIN_OR_PASSWORD__", this.response);
            // выходим из метода
            return;
        }

        // если имя ролика содержит запретные символы
        if(new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](movieName).normalString() === false) {
            // отправляем ответ, что имя ролика имеет запретные символы
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_MOVIE_NAME__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // формируем запрос к СУБД
        const query = new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__["a" /* default */]("create_or_update_movie", [login, password, movieName, new __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_StringCodeManager__["a" /* default */](movieContent).codeString()]).generateQuery();
        // отправляем запрос в СУБД
        new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */](answer, this.response);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MovieCreator;



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_FieldsFinder__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_StringGenerator__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__ = __webpack_require__(0);








// класс - контроллер для получения списка роликов определённого пользователя
class RolixListController {
    // конструктор
    constructor(pg, body, SHA256, response) {
        // инициализируем объект для взаимодействия с СУБД
        this.pg = pg;
        // инициализируем тело POST запроса
        this.body = body;
        // инициализируем объект для получения HASH от пароля
        this.SHA256 = SHA256;
        // инициализируем объект для отправки ответа клиенту
        this.response = response;
        // вызываем метод для получения списка роликов определённого пользователя
        this.getRolixOfUser();
    }

    // метод для получения списка роликов определённого пользователя
    getRolixOfUser() {
        // тело запроса
        const body = this.body;

        // проверяем наличие необходимых полей в теле запроса
        // если у объекта нет поля логина
        if(new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField"]).controleFields() === false) {
            // отсылаем ответ клиенту, что нет поля логина в теле запроса
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__LOGIN_FIELD_NOT_FOUND__", this.response);
            // выходим из метода
            return;
        }

        // сохраняем переданный логин
        const login = (body.loginField + "").toString();

        // если логин пустой
        if(login === "") {
            // отправляем ответ клиенту, что логин пустой
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если логин длиннее 10-ти символов
        if(login.length > 10) {
            // отправляем ответ, что логин слишком длинный
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // если логин содержит запретные символы
        if(new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false) {
            // отправляем ответ клиенту, что логин содержит запретные символы
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_LOGIN__", this.response);
            // выходим из метода
            return;
        }

        // объект для сохранения ответа от СУБД
        let res = {
            arr: []
        };

        // генерируем строку-запрос для отправки в СУБД
        const query = new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_StringGenerator__["a" /* default */]("get_rolix_list", [login]).generateQuery();
        // отправляем запрос в СУБД
        new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            // сохраняем ответ в строку
            const answer = res.arr[0].answer.toString();
            // отправляем ответ клиенту
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */](answer, this.response);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RolixListController;



/***/ })
/******/ ]);