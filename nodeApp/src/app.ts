import { createInterface } from "readline";
import { startServer, stopServer } from "./server";
import { WebSocketServer } from "ws";
import { Server } from "http";

const rlInterface = createInterface(process.stdin, process.stdout);
let server: Server | undefined, wss: WebSocketServer | undefined;
let set: boolean = false;

rlInterface.setPrompt(">");
rlInterface.prompt();
rlInterface.on("line", (s: string) => {
    const input = s.trim().split(" ");

    switch (input[0]) {
        case "start":
            const port: number = (input.at(1) == undefined)?3000:Number(input.at(1));
            rlInterface.write(`Server running at : http://localhost:${port}`);
            ({wss, server} = startServer(port));
            set = true;
            break;
        case "stop":
            if(set) {
                stopServer(wss as WebSocketServer, server as Server);
                ({wss, server} = {"wss": undefined, "server": undefined});
                set = false;
            }
            break;
        case "exit":
            if(set) {
                stopServer(wss as WebSocketServer, server as Server);
            }
            rlInterface.close();
            return;
        default:
            rlInterface.write("Unrecognized command. Try: start, stop");
            break;
    }
    rlInterface.prompt();
})

// const arg1: string | undefined = process.argv.at(2);
// const port: number = (arg1 == undefined)?3000:Number(arg1);

// startServer(port);