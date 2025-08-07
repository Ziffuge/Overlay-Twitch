import { WebSocketServer } from "ws";
import { Counter } from "./Counter.js";

export class ServerCore {
    private counters: Counter[];
    private wss!: WebSocketServer;

    constructor() {
        this.counters = new Array();
        console.log("ServerCore initialized");
    }

    public isValidId(id: number): boolean {
        return 0 <= id && id < this.counters.length;
    }

    public getCounter(id: number): Counter {
        if(! this.isValidId(id)) {
            throw new RangeError(`Unknown counter index number : ${id}`);
        } else {
            return this.counters[id];
        }
    }

    public getValue(id: number): number {
        if(! this.isValidId(id)) {
            throw new RangeError(`Unknown counter index number : ${id}`);
        } else {
            return this.counters[id].value;
        }
    }

    public updateCounter(id: number, value: number, mode: "increment" | "decrement"): void {
        if(! this.isValidId(id)) {
            throw new RangeError(`Unknown counter index number : ${id}`);
        } else {
            const currentValue = this.counters[id].value;
            const newValue = mode === "increment" ? currentValue + value : currentValue - value;
            this.counters[id].value = newValue;
            this.broadcast(JSON.stringify({"type": "counter", "id": id, "value": newValue}));
        }
    }

    public addCounter(file: string): number {
        return this.counters.push(new Counter(file)) - 1;
    }

    public counterFromFile(file: string): number {
        return this.counters.findIndex((c) => c.file == file);
    }

    public registerWSS(wss: WebSocketServer): void {
        this.wss = wss;
    }

    private broadcast(message: any): void {
        this.wss.clients.forEach((ws) => ws.send(message));
    }
}