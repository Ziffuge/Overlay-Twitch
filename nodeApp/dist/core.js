"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerCore = void 0;
const Counter_1 = require("./Counter");
class ServerCore {
    constructor() {
        this.counters = new Array();
        console.log("ServerCore initialized");
    }
    isValidId(id) {
        return 0 <= id && id < this.counters.length;
    }
    getCounter(id) {
        if (!this.isValidId(id)) {
            throw new RangeError(`Unknown counter index number : ${id}`);
        }
        else {
            return this.counters[id];
        }
    }
    getValue(id) {
        if (!this.isValidId(id)) {
            throw new RangeError(`Unknown counter index number : ${id}`);
        }
        else {
            return this.counters[id].value;
        }
    }
    updateCounter(id, value, mode) {
        if (!this.isValidId(id)) {
            throw new RangeError(`Unknown counter index number : ${id}`);
        }
        else {
            const currentValue = this.counters[id].value;
            const newValue = mode === "increment" ? currentValue + value : currentValue - value;
            this.counters[id].value = newValue;
            this.broadcast(JSON.stringify({ "type": "counter", "id": id, "value": newValue }));
        }
    }
    addCounter(file) {
        return this.counters.push(new Counter_1.Counter(file)) - 1;
    }
    counterFromFile(file) {
        return this.counters.findIndex((c) => c.file == file);
    }
    registerWSS(wss) {
        this.wss = wss;
    }
    broadcast(message) {
        this.wss.clients.forEach((ws) => ws.send(message));
    }
}
exports.ServerCore = ServerCore;
