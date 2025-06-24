import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import path from "path";
import { ServerCore } from "./core";
import { CounterHandler, CounterIDHandler, MessageDispatcher } from "./messageHandlers";


// + ============================================================ +
// | Local Server : Bundle an express app with a websocket server |
// + ============================================================ +

export function startServer(port: number) {
    const core = new ServerCore();
    const staticPath = path.join(__dirname, '..', 'static_pages');
    const messageDispatcher = new MessageDispatcher(
        new CounterHandler(core),
        new CounterIDHandler(core, staticPath)
    );

    const app = express();
    const server = http.createServer(app);
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

function initExpressApp(app: express.Application, staticPath: string, messageDispatcher: MessageDispatcher) {

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

    app.use(express.json());

    app.use(express.static(staticPath));

    app.post("/death_counter", (req, res) => {

        try {
            const {handler, parsed} = messageDispatcher.dispatch(req.body);
            res.status(200).send(handler.handle(parsed));
        } catch (error) {
            console.log(`(Express) Received an ill-foramted message: ${req.body.string}`);
            res.status(406).send({ error: `Ill-formated message`});
        }
    });

    app.get('/', (req, res) => {
        res.send('Hello, Node.js!');
    });
}



// + ============================================== +
// | Web Socket Server : application layer protocol |
// + ============================================== +

function initWebSocketServer(server: http.Server, messageDispatcher: MessageDispatcher): WebSocketServer {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log("New Socket Connected ^^");
        
        ws.on("message", (message) => {
            try {
                const {handler, parsed} = messageDispatcher.dispatch(JSON.parse(message.toString("utf-8")));
                ws.send(JSON.stringify(handler.handle(parsed)));
            } catch (error) {
                console.log(error);
                console.log(`(WS) Received an ill-formated message: ${message}`);
                ws.send(JSON.stringify({ error: `Ill-formated message`}));
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

function closeWebSocketServer(wss: WebSocketServer, callback: ((err?: Error) => void)) {
    if(wss.clients.size == 0) {
        return callback();
    }

    // Close all individual WebSocket connections 
    wss.clients.forEach((client) => { 
        if(client.readyState === WebSocket.OPEN) { 
            client.close(1000, 'Server is shutting down');
        } 
    });

    // Wait for all clients to close (5 seconds)
    setTimeout(() => { 
        wss.close(callback); 
    }, 5000);
}