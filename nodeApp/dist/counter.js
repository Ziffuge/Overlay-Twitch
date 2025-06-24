"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counter = void 0;
class Counter {
    constructor(file) {
        this._value = 0;
        this._file = file;
    }
    get value() {
        return this._value;
    }
    get file() {
        return this._file;
    }
    set value(v) {
        this._value = v;
    }
}
exports.Counter = Counter;
