import { Command } from "commander";
import { startServer, stopServer } from "./Core/server.js";
import { launchUI } from "./app.js";

const program = new Command();

program.option("-s, --server")
    .option("-p, --port <number>", "Set the port number used by the local server");

program.parse();

const options = program.opts();

if(options.server) {
    // Start server
    const port: number = options.port;
    const {wss, server} = startServer(port);

    process.on("SIGINT", () => {
        stopServer(wss, server);
        process.exit(0);
    });
    process.on("SIGTERM", () => {
        stopServer(wss, server);
        process.exit(0);
    });
} else {
    // Launch UI
    launchUI();
}