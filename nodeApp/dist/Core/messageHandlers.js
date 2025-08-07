import path from "path";
import fs from "fs";
import { z } from "zod";
const BaseMessage = z.object({
    "type": z.string()
});
// Routes messages
export class MessageDispatcher {
    constructor(counterMH, counterIDMH) {
        this.counterMH = counterMH;
        this.counterIDMH = counterIDMH;
    }
    testHandler(handler, raw) {
        if (handler.isValidMessage(raw)) {
            return { handler: handler, parsed: handler.parseMessage(raw) };
        }
        throw Error(`Ill-formated '${raw.type}' message`);
    }
    dispatch(raw) {
        const baseParsing = BaseMessage.safeParse(raw);
        if (!baseParsing.success) {
            console.error(baseParsing.error.format());
            throw Error(`Unacceptable message format: ${raw}`);
        }
        switch (baseParsing.data.type) {
            case "counter":
                return this.testHandler(this.counterMH, raw);
            case "counter-id":
                return this.testHandler(this.counterIDMH, raw);
            default:
                throw Error(`Unrecognized message type ${baseParsing.data.type}`);
        }
    }
}
export class CounterHandler {
    constructor(core) {
        this.core = core;
    }
    isValidMessage(raw) {
        return CounterHandler.CounterMessage.safeParse(raw).success;
    }
    parseMessage(raw) {
        return CounterHandler.CounterMessage.parse(raw);
    }
    handle(data) {
        if (!this.core.isValidId(data.id)) {
            return { error: `Invalid counter id ${data.id}` };
        }
        this.core.updateCounter(data.id, data.value, data.mode);
        return { "id": data.id, "value": this.core.getValue(data.id) };
    }
}
CounterHandler.CounterMessage = BaseMessage.extend({
    "type": z.literal("counter"),
    "id": z.number(),
    "value": z.number(),
    "mode": z.enum(["increment", "decrement"])
});
export class CounterIDHandler {
    constructor(core, staticPath) {
        this.core = core;
        this.staticPath = staticPath;
    }
    isValidMessage(raw) {
        return CounterIDHandler.CounterIdMessage.safeParse(raw).success;
    }
    parseMessage(raw) {
        return CounterIDHandler.CounterIdMessage.parse(raw);
    }
    handle(data) {
        const filePath = path.join(this.staticPath, data.from);
        if (!fs.existsSync(filePath)) {
            console.log(`Couldn't find ${filePath}`);
            return { error: `Couldn't find the given ressources path: ${data.from}` };
        }
        var id = this.core.counterFromFile(data.from);
        if (id == -1) {
            id = this.core.addCounter(data.from);
        }
        return { "type": "counter-id", "id": id, "value": this.core.getValue(id) };
    }
}
CounterIDHandler.CounterIdMessage = BaseMessage.extend({
    "type": z.literal("counter-id"),
    "from": z.string()
});
