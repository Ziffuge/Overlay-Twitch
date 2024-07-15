"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
function startServer() {
    const server = (0, express_1.default)();
    const port = 3000;
    var counter = 0;
    server.get('/', (req, res) => {
        res.send('Hello, Node.js!');
    });
    server.use(express_1.default.static(path_1.default.join(__dirname, '..', 'static_pages', 'death_counter')));
    server.use(body_parser_1.default.json());
    server.get('/death_counter', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '..', 'static_pages', 'death_counter', 'index.html'));
    });
    server.post('/death_counter', (req, res) => {
        const { increment } = req.body;
        if (increment == 1) {
            counter++;
        }
        res.send({ counter: counter });
    });
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
