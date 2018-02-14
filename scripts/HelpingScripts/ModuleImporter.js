"use strict";

export default class ModuleImporter {
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
