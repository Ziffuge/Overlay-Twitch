export class Counter {
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
