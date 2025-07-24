"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = require("readline");
const server_1 = require("./server");
const rlInterface = (0, readline_1.createInterface)(process.stdin, process.stdout);
let server, wss;
let set = false;
rlInterface.setPrompt(">");
rlInterface.prompt();
rlInterface.on("line", (s) => {
    const input = s.trim().split(" ");
    switch (input[0]) {
        case "start":
            const port = (input.at(1) == undefined) ? 3000 : Number(input.at(1));
            rlInterface.write(`Server running at : http://localhost:${port}`);
            ({ wss, server } = (0, server_1.startServer)(port));
            set = true;
            break;
        case "stop":
            if (set) {
                (0, server_1.stopServer)(wss, server);
                ({ wss, server } = { "wss": undefined, "server": undefined });
                set = false;
            }
            break;
        case "exit":
            if (set) {
                (0, server_1.stopServer)(wss, server);
            }
            rlInterface.close();
            return;
        default:
            rlInterface.write("Unrecognized command. Try: start, stop");
            break;
    }
    rlInterface.prompt();
});
// const arg1: string | undefined = process.argv.at(2);
// const port: number = (arg1 == undefined)?3000:Number(arg1);
// startServer(port);
