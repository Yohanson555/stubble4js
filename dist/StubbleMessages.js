"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifyMessage = exports.ProcessMessage = exports.InitMessage = void 0;
class InitMessage {
    constructor(value) {
        this.value = value;
    }
    getName() {
        return "init";
    }
    getCode() {
        return "-";
    }
}
exports.InitMessage = InitMessage;
class ProcessMessage {
    constructor(charCode) {
        this.charCode = charCode;
    }
    getName() {
        return "process";
    }
    getCode() {
        return String.fromCharCode(this.charCode);
    }
}
exports.ProcessMessage = ProcessMessage;
class NotifyMessage {
    constructor(type, charCode, value) {
        this.type = type;
        this.charCode = charCode;
        this.value = value;
    }
    getName() {
        return "notify";
    }
    getCode() {
        return '-';
    }
}
exports.NotifyMessage = NotifyMessage;
//# sourceMappingURL=StubbleMessages.js.map