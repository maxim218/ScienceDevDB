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


class ResponseWriter {
    constructor(message, response) {
        this.setMessage(message);
        this.setResponse(response);
        this.sendAnswerToClient();
    }

    setMessage(message) {
        this.messageContent = message.toString();
    }

    setResponse(response) {
        this.response = response;
    }

    sendAnswerToClient() {
        this.response.status(200);
        console.log("Answer: " + this.messageContent);
        console.log("------------------------------------------");
        this.response.end(this.messageContent);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ResponseWriter;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class QuerySender {
    constructor(pg) {
        this.pg = pg;
    }

    createNewClient() {
        const pg = this.pg;
        return new pg.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'sciencedevdb',
            password: '123',
            port: 5432
        });
    }

    makeQuery(query, resultObj, callback) {
        const client = this.createNewClient();
        client.connect();

        client.query(query, (err, res) => {
            if(err !== null && err !== undefined) {
                console.log(err);
            }

            resultObj.arr = res.rows;
            client.end();
            callback();
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = QuerySender;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class ContentStringWatcher {
    constructor(s) {
        this.s = s;
    }

    static normalChar(charParam) {
        const c = charParam.toLowerCase();
        const allowedChars = "abcdefghijklmnopqrstuvwxyz0123456789";
        return allowedChars.indexOf(c) !== -1;
    }

    normalString() {
        const s = this.s;
        for(let i = 0; i < s.length; i++) {
            const c = s.charAt(i);
            if(ContentStringWatcher.normalChar(c) === false) {
                return false;
            }
        }
        return true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ContentStringWatcher;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class FieldsFinder {
    constructor(obj, fieldsArray) {
        this.obj = obj;
        this.fieldsArray = fieldsArray;
    }

    controleFields() {
        const obj = this.obj;
        const fieldsArray = this.fieldsArray;

        for(let i = 0; i < fieldsArray.length; i++) {
            const fieldName = fieldsArray[i].toString();
            if(obj[fieldName] === null || obj[fieldName] === undefined) {
                return false;
            }
        }

        return true;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FieldsFinder;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class StringGenerator {
    constructor(functionName, paramsArray) {
        this.functionName = functionName;
        this.paramsArray = paramsArray;
    }

    generateQuery() {
        const functionName = this.functionName;
        const paramsArray = this.paramsArray;

        for(let i = 0; i < paramsArray.length; i++) {
            paramsArray[i] = "'" + paramsArray[i] + "'";
        }

        const queryString = " SELECT * FROM " + functionName + "(" + paramsArray.join(",") + ") AS answer; ";
        console.log("Query: " + queryString);

        return queryString;
    }

    generateQueryNoAnswer() {
        const functionName = this.functionName;
        const paramsArray = this.paramsArray;

        for(let i = 0; i < paramsArray.length; i++) {
            paramsArray[i] = "'" + paramsArray[i] + "'";
        }

        const queryString = " SELECT * FROM " + functionName + "(" + paramsArray.join(",") + "); ";
        console.log("Query: " + queryString);

        return queryString;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StringGenerator;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ContentStringWatcher__ = __webpack_require__(2);




class PasswordHashModifier {
    constructor(passwordHash) {
        this.passwordHash = (passwordHash + "").toString();
    }

    modifyIt() {
        const passwordHash = this.passwordHash.toUpperCase();
        let answer = "";

        for(let i = 0; i < passwordHash.length; i++) {
            const c = passwordHash.charAt(i);
            if(__WEBPACK_IMPORTED_MODULE_0__ContentStringWatcher__["a" /* default */].normalChar(c) === true) {
                answer += c;
            } else {
                answer += "A";
            }
        }

        answer = "ABAB" + answer + "ABAB";

        return answer;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PasswordHashModifier;
;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class ModuleImporter {
    constructor(s) {
        this.initModuleName(s);
    }

    initModuleName(s) {
        this.moduleName = s.toString();
    }

    getModule() {
        const command = " require('" + this.moduleName + "'); ";
        return eval(command);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ModuleImporter;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";


class StringCodeManager {
    constructor(stringParam) {
        this.s = (stringParam + "").toString();
    }

    static getNumberOfChar(c) {
        return c.charCodeAt(0);
    }

    codeString() {
        const s = this.s;
        const mass = [];

        for(let i = 0; i < s.length; i++) {
            const c = s.charAt(i);
            const n = StringCodeManager.getNumberOfChar(c);
            mass.push(n);
        }

        return mass.join("_");
    }

    decodeString() {
        const s = (this.s + "").toString();
        const mass = s.split("_");

        let answer = "";

        for(let i = 0; i < mass.length; i++) {
            const n = mass[i];
            answer += String.fromCharCode(n);
        }

        return answer;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StringCodeManager;



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ModuleImporter__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__QueryGetter__ = __webpack_require__(10);





class ServerStarter {
    constructor(portNumber) {
        let express = new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ModuleImporter__["a" /* default */]("express").getModule();
        this.app = express();
        this.allowQueries();
        this.startServer(portNumber);
        this.queryGetter = new __WEBPACK_IMPORTED_MODULE_1__QueryGetter__["a" /* default */](this.app);
    }

    allowQueries() {
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
    }

    startServer(portNumber) {
        const port = process.env.PORT || portNumber;
        this.app.listen(port);
        console.log("------------------------------------------");
        console.log("Server works on port " + port);
        console.log("------------------------------------------");
    }
}

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





class QueryGetter {
    constructor(app) {
        this.app = app;
        this.useGetQueries();
        this.usePostQueries();
        this.urlManager = new __WEBPACK_IMPORTED_MODULE_0__UrlManager__["a" /* default */](this.app);

        this.allowedOperationsGet = [
            "about_server",
            "init_database",
        ];

        this.allowedOperationsPost = [
            "registrate_user",
            "authorize_user",
            "add_record",
            "get_records",
        ];
    }

    static printInfo(type, request, response, operation, body) {
        console.log("Method: " + type);
        console.log("Url: " + request.url);
        console.log("Operation: " + operation);

        if(type === "POST") {
            console.log("Body: " + body);
        }
    }

    static getOperation(url) {
        const mass = url.toString().split("/");
        return mass[1];
    }

    useGetQueries() {
        this.app.get('/*', (request, response) => {
            const url = request.url;
            const operation = QueryGetter.getOperation(url);
            QueryGetter.printInfo("GET", request, response, operation, null);
            if(this.allowedOperationsGet.indexOf(operation) === -1) {
                new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALLOWED_OPERATION__", response);
            } else {
                this.urlManager.routeQuery(request, response, operation, url, null);
            }
        });
    }

    usePostQueries() {
        this.app.post('/*', (request, response) => {
            const url = request.url;
            const operation = QueryGetter.getOperation(url);
            if(this.allowedOperationsPost.indexOf(operation) === -1) {
                new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALLOWED_OPERATION__", response);
            } else {
                let dataString = "";
                request.on('data', (data) => {
                    dataString += data;
                }).on('end', () => {
                    try {
                        QueryGetter.printInfo("POST", request, response, operation, dataString);
                        const body = JSON.parse(dataString);
                        this.urlManager.routeQuery(request, response, operation, url, body);
                    } catch (err) {
                        console.log("ERROR: " + err);
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










class UrlManager {
    constructor(app) {
        this.app = app;
        this.pg = new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ModuleImporter__["a" /* default */]("pg").getModule();
        this.SHA256 = new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ModuleImporter__["a" /* default */]("crypto-js/sha256").getModule();
        this.fs = new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ModuleImporter__["a" /* default */]("fs").getModule();
    }

    routeQuery(request, response, operation, url, body) {
        if(operation === "about_server") {
            new __WEBPACK_IMPORTED_MODULE_0__ControllersScripts_AboutServerController__["a" /* default */](response);
            return;
        }

        if(operation === "init_database") {
            new __WEBPACK_IMPORTED_MODULE_2__ControllersScripts_DataBaseIniter__["a" /* default */](this.fs, this.pg, response);
            return;
        }

        if(operation === "registrate_user") {
            new __WEBPACK_IMPORTED_MODULE_3__ControllersScripts_UserRegistrator__["a" /* default */](this.pg, body, this.SHA256, response);
            return;
        }

        if(operation === "authorize_user") {
            new __WEBPACK_IMPORTED_MODULE_4__ControllersScripts_UserAuthorizer__["a" /* default */](this.pg, body, this.SHA256, response);
            return;
        }

        if(operation === "add_record") {
            new __WEBPACK_IMPORTED_MODULE_5__ControllersScripts_RecordAdder__["a" /* default */](this.pg, body, this.SHA256, response);
            return;
        }

        if(operation === "get_records") {
            new __WEBPACK_IMPORTED_MODULE_6__ControllersScripts_RecordsGetter__["a" /* default */](this.pg, body, response);
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




class AboutServerController {
    constructor(response) {
        const answer = "__DATABASE_SERVER_CREATED_BY_KOLOTOVKIN_MAXIM__";
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





class DataBaseIniter {
    constructor(fs, pg, response) {
        this.fs = fs;
        this.pg = pg;
        this.response = response;
        this.readSqlFromFileAndInitDB();
    }

    readSqlFromFileAndInitDB() {
        const fs = this.fs;
        const pg = this.pg;
        const response = this.response;

        fs.readFile("database.sql", function(err, data) {
            const content = data.toString();
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_QuerySender__["a" /* default */](pg).makeQuery(content, {}, () => {
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_FieldsFinder__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_StringGenerator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_PasswordHashModifier__ = __webpack_require__(5);









class UserRegistrator {
    constructor(pg, body, SHA256, response) {
        this.pg = pg;
        this.body = body;
        this.SHA256 = SHA256;
        this.response = response;
        this.registrateUser();
    }

    registrateUser() {
        const body = this.body;

        if(new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField", "passwordField"]).controleFields() === false) {
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALL_FIELDS__", this.response);
            return;
        }

        const login = (body.loginField + "").toString();
        const password = (body.passwordField + "").toString();

        if(login === "" || password === "") {
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_FIELD__", this.response);
            return;
        }

        if(login.length > 10 || password.length > 10) {
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_FIELD__", this.response);
            return;
        }

        if(new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false || new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_ContentStringWatcher__["a" /* default */](password).normalString() === false) {
            new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_FIELD__", this.response);
            return;
        }

        let res = {
            arr: []
        };

        const query = new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_StringGenerator__["a" /* default */]("add_user", [login, new __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_PasswordHashModifier__["a" /* default */](this.SHA256(password)).modifyIt()]).generateQuery();
        new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            const answer = res.arr[0].answer.toString();
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_PasswordHashModifier__ = __webpack_require__(5);









class UserAuthorizer {
    constructor(pg, body, SHA256, response) {
        this.pg = pg;
        this.body = body;
        this.SHA256 = SHA256;
        this.response = response;
        this.authorizeUser();
    }

    authorizeUser() {
        const body = this.body;

        if(new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField", "passwordField"]).controleFields() === false) {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALL_FIELDS__", this.response);
            return;
        }

        const login = (body.loginField + "").toString();
        const password = (body.passwordField + "").toString();

        if(login === "" || password === "") {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_FIELD__", this.response);
            return;
        }

        if(login.length > 10 || password.length > 10) {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_FIELD__", this.response);
            return;
        }

        if(new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false || new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](password).normalString() === false) {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_FIELD__", this.response);
            return;
        }

        let res = {
            arr: []
        };

        const query = new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__["a" /* default */]("normal_login_password", [login, new __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_PasswordHashModifier__["a" /* default */](this.SHA256(password)).modifyIt()]).generateQuery();
        new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            const answer = res.arr[0].answer.toString();
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_StringCodeManager__ = __webpack_require__(7);









class RecordAdder {
    constructor(pg, body, SHA256, response) {
        this.pg = pg;
        this.body = body;
        this.SHA256 = SHA256;
        this.response = response;
        this.addRecord();
    }

    addRecord() {
        const body = this.body;

        if(new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField", "passwordField", "contentField"]).controleFields() === false) {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__NOT_ALL_FIELDS__", this.response);
            return;
        }

        const login = (body.loginField + "").toString();
        const password = (body.passwordField + "").toString();
        const content = (body.contentField + "").toString();

        if(login === "" || password === "") {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_LOGIN_OR_PASSWORD__", this.response);
            return;
        }

        if(content === "") {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__EMPTY_CONTENT__", this.response);
            return;
        }

        if(login.length > 10) {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_LOGIN__", this.response);
            return;
        }

        if(content.length > 400) {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_CONTENT__", this.response);
            return;
        }

        if(new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false || new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](password).normalString() === false) {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_FIELD_LOGIN_OR_PASSWORD__", this.response);
            return;
        }

        let res = {
            arr: []
        };

        const query = new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__["a" /* default */]("add_record", [login, password, new __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_StringCodeManager__["a" /* default */](content).codeString()]).generateQuery();
        new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            const answer = res.arr[0].answer.toString();
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__HelpingScripts_PasswordHashModifier__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__HelpingScripts_StringCodeManager__ = __webpack_require__(7);










class RecordsGetter {
    constructor(pg, body, response) {
        this.pg = pg;
        this.body = body;
        this.response = response;
        this.getRecords();
    }

    getRecords() {
        const body = this.body;

        if(new __WEBPACK_IMPORTED_MODULE_1__HelpingScripts_FieldsFinder__["a" /* default */](body, ["loginField"]).controleFields() === false) {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__FIELD_NOT_FOUND__", this.response);
            return;
        }

        const login = (body.loginField + "").toString();

        if(login === "") {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__LOGIN_FIELD_EMPTY__", this.response);
            return;
        }

        if(login.length > 10) {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__LONG_FIELD_VERY_LONG__", this.response);
            return;
        }

        if(new __WEBPACK_IMPORTED_MODULE_2__HelpingScripts_ContentStringWatcher__["a" /* default */](login).normalString() === false) {
            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */]("__BAD_CHARS_FIELD_LOGIN__", this.response);
            return;
        }

        let res = {
            arr: []
        };

        const query = new __WEBPACK_IMPORTED_MODULE_3__HelpingScripts_StringGenerator__["a" /* default */]("get_records_of_user", [login]).generateQueryNoAnswer();
        new __WEBPACK_IMPORTED_MODULE_4__HelpingScripts_QuerySender__["a" /* default */](this.pg).makeQuery(query, res, () => {
            const mass = res.arr;
            const answer = [];

            for(let i = 0; i < mass.length; i++) {
                const element = mass[i];
                const contentString = new __WEBPACK_IMPORTED_MODULE_6__HelpingScripts_StringCodeManager__["a" /* default */](element.record_content_t + "").decodeString();

                answer.push({
                    r_id: element.record_id_t,
                    m_id: element.man_id_t,
                    m_nn: element.man_nickname_t,
                    r_cc: contentString
                })
            }

            new __WEBPACK_IMPORTED_MODULE_0__HelpingScripts_ResponseWriter__["a" /* default */](JSON.stringify(answer), this.response);
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RecordsGetter;



/***/ })
/******/ ]);