"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
function startServer() {
    const server = (0, express_1.default)();
    const configPath = 'serverConfig.json';
    var port = 3000, counter = 0;
    try {
        const configData = fs_1.default.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configData);
        port = config.port;
        counter = config.counter;
    }
    catch (error) {
        console.log("Error reading config file :", error);
    }
    server.get('/', (req, res) => {
        res.send('Hello, Node.js!');
    });
    server.use(express_1.default.static(path_1.default.join(__dirname, '..', 'static_pages')));
    server.use(body_parser_1.default.json());
    server.get('/death_counter', (req, res) => {
        res.status(200).sendFile(path_1.default.join(__dirname, '..', 'static_pages', 'death_counter', 'index.html'));
    });
    server.post('/death_counter', (req, res) => {
        const { increment } = req.body;
        if (increment == 1) {
            counter++;
        }
        res.status(200).send({ counter: counter });
    });
    server.get('/config', (req, res) => {
        res.status(200).sendFile(path_1.default.join(__dirname, '..', 'static_pages', 'config', 'index.html'));
    });
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
