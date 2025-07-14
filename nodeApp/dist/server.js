"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const core_1 = require("./core");
const messageHandlers_1 = require("./messageHandlers");
// + ============================================================ +
// | Local Server : Bundle an express app with a websocket server |
// + ============================================================ +
function startServer(port) {
    const core = new core_1.ServerCore();
    const staticPath = path_1.default.join(__dirname, '..', 'static_pages');
    const messageDispatcher = new messageHandlers_1.MessageDispatcher(new messageHandlers_1.CounterHandler(core), new messageHandlers_1.CounterIDHandler(core, staticPath));
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    const wss = initWebSocketServer(server, messageDispatcher);
    core.registerWSS(wss);
    initExpressApp(app, staticPath, messageDispatcher);
    server.listen(port, "0.0.0.0", () => {
        console.log(`Server running at http://localhost:${port}`);
    });
    // Graceful Shutdown
    process.on('SIGINT', () => {
        console.log('Received SIGINT. Gracefully shutting down...');
        // Initiate shutdown sequence : WebSockets -> HTTP -> Process
        closeWebSocketServer(wss, () => {
            console.log('WebSocketServer closed.');
            server.close(() => {
                console.log('HTTP server closed.');
                process.exit(0);
            });
        });
        // Forceful shut down
        setTimeout(() => {
            console.error('Could not close connections in time, forcefully shutting down.');
            process.exit(1);
        }, 10000);
    });
}
// + ==================================== +
// | Express App : Distributes HTML Pages |
// + ==================================== +
function initExpressApp(app, staticPath, messageDispatcher) {
    // const configPath = 'serverConfig.json';
    // var port: number = 3000, counter: number = 0;
    // try {
    //     const configData = fs.readFileSync(configPath, 'utf8');
    //     const config = JSON.parse(configData);
    //     port = config.port;
    //     counter = config.counter;
    // } catch (error) {
    //     console.log("Error reading config file :", error);
    // }
    app.use(express_1.default.json());
    app.use(express_1.default.static(staticPath));
    app.post("/death_counter", (req, res) => {
        try {
            const { handler, parsed } = messageDispatcher.dispatch(req.body);
            res.status(200).send(handler.handle(parsed));
        }
        catch (error) {
            console.log(error);
            console.log(`(Express) Received an ill-formated message: ${JSON.stringify(req.body)}`);
            res.status(406).send({ error: `Ill-formated message` });
        }
    });
    app.get('/', (req, res) => {
        res.send('Hello, Node.js!');
    });
}
// + ============================================== +
// | Web Socket Server : application layer protocol |
// + ============================================== +
function initWebSocketServer(server, messageDispatcher) {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on('connection', (ws) => {
        console.log("New Socket Connected ^^");
        ws.on("message", (message) => {
            try {
                const { handler, parsed } = messageDispatcher.dispatch(JSON.parse(message.toString("utf-8")));
                ws.send(JSON.stringify(handler.handle(parsed)));
            }
            catch (error) {
                console.log(error);
                console.log(`(WS) Received an ill-formated message: ${message}`);
                ws.send(JSON.stringify({ error: `Ill-formated message` }));
            }
        });
        //send immediatly a feedback to the incoming connection
        ws.send(JSON.stringify({
            type: 'connection',
            status: 'success'
        }));
        ws.on("close", (code, reason) => {
            ws.close(code, reason);
        });
    });
    return wss;
}
function closeWebSocketServer(wss, callback) {
    if (wss.clients.size == 0) {
        return callback();
    }
    // Close all individual WebSocket connections 
    wss.clients.forEach((client) => {
        if (client.readyState === ws_1.WebSocket.OPEN) {
            client.close(1000, 'Server is shutting down');
        }
    });
    // Wait for all clients to close (5 seconds)
    setTimeout(() => {
        wss.close(callback);
    }, 5000);
}
