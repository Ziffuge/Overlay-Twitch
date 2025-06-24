"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterIDHandler = exports.CounterHandler = exports.MessageDispatcher = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const zod_1 = require("zod");
const BaseMessage = zod_1.z.object({
    "type": zod_1.z.string()
});
// Routes messages
class MessageDispatcher {
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
exports.MessageDispatcher = MessageDispatcher;
class CounterHandler {
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
exports.CounterHandler = CounterHandler;
CounterHandler.CounterMessage = BaseMessage.extend({
    "type": zod_1.z.literal("counter"),
    "id": zod_1.z.number(),
    "value": zod_1.z.number(),
    "mode": zod_1.z.enum(["increment", "decrement"])
});
class CounterIDHandler {
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
        const filePath = path_1.default.join(this.staticPath, data.from);
        if (!fs_1.default.existsSync(filePath)) {
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
exports.CounterIDHandler = CounterIDHandler;
CounterIDHandler.CounterIdMessage = BaseMessage.extend({
    "type": zod_1.z.literal("counter-id"),
    "from": zod_1.z.string()
});
