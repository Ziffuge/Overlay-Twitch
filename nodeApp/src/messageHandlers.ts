import path from "path";
import fs from "fs";
import { ServerCore } from "./core";
import { z } from "zod";

const BaseMessage = z.object({
    "type": z.string()
});

// Routes messages
export class MessageDispatcher {
    
    constructor(
        private counterMH: MessageHandler,
        private counterIDMH: MessageHandler,
    ) {}

    private testHandler(handler: MessageHandler, raw: any) {
        if(handler.isValidMessage(raw)) {
            return {handler: handler, parsed: handler.parseMessage(raw)}
        }
        throw Error(`Ill-formated '${raw.type}' message`);
    }

    public dispatch(raw: any): {handler: MessageHandler, parsed: any} {
        const baseParsing = BaseMessage.safeParse(raw);
        if(!baseParsing.success) {
            console.error(baseParsing.error.format());
            throw Error(`Unacceptable message format: ${raw}`);
        }

        switch(baseParsing.data.type) {
            case "counter":
                return this.testHandler(this.counterMH, raw);
            case "counter-id":
                return this.testHandler(this.counterIDMH, raw);
            default:
                throw Error(`Unrecognized message type ${baseParsing.data.type}`);
        }
    }
}

export interface MessageHandler {
    isValidMessage(raw: any): boolean,
    parseMessage(raw: any): any,
    handle(data: any): any;
}

export class CounterHandler implements MessageHandler {

    static CounterMessage = BaseMessage.extend({
        "type": z.literal("counter"),
        "id": z.number(),
        "value": z.number(),
        "mode": z.enum(["increment", "decrement"])
    });

    constructor(private core: ServerCore) {}

    public isValidMessage(raw: any): boolean {
        return CounterHandler.CounterMessage.safeParse(raw).success;
    }

    public parseMessage(raw: any): any {
        return CounterHandler.CounterMessage.parse(raw);
    }

    public handle(data: any): any {
        if(! this.core.isValidId(data.id)) {
            return { error: `Invalid counter id ${data.id}`};
        }

        this.core.updateCounter(data.id, data.value, data.mode);
        return {"id": data.id, "value": this.core.getValue(data.id)};
    }
}

export class CounterIDHandler implements MessageHandler {

    static CounterIdMessage = BaseMessage.extend({
        "type": z.literal("counter-id"),
        "from": z.string()
    });

    constructor(private core: ServerCore, private staticPath: string) {}

    public isValidMessage(raw: any): boolean {
        return CounterIDHandler.CounterIdMessage.safeParse(raw).success;
    }

    public parseMessage(raw: any) {
        return CounterIDHandler.CounterIdMessage.parse(raw);
    }

    public handle(data: any): any {
        const filePath = path.join(this.staticPath, data.from);
        if(! fs.existsSync(filePath)) {
            console.log(`Couldn't find ${filePath}`);
            return { error: `Couldn't find the given ressources path: ${data.from}`};
        }

        var id = this.core.counterFromFile(data.from);
        if(id == -1) {
            id = this.core.addCounter(data.from);
        }
        return {"type": "counter-id", "id": id, "value": this.core.getValue(id)};
    }
}