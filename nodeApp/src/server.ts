import express from "express";
import path from "path";
import bodyParser from "body-parser";
import fs from "fs";

export function startServer() {
    const server = express();
    const configPath = 'serverConfig.json';
    var port: number = 3000, counter: number = 0;
    try {
        const configData = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configData);
        port = config.port;
        counter = config.counter;
    } catch (error) {
        console.log("Error reading config file :", error);
    }
    
    server.get('/', (req, res) => {
        res.send('Hello, Node.js!');
    });
    
    server.use(express.static(path.join(__dirname, '..', 'static_pages')));
    
    server.use(bodyParser.json());
    
    server.get('/death_counter', (req, res) => {
        res.status(200).sendFile(path.join(__dirname, '..', 'static_pages','death_counter', 'index.html'));
    });
    
    server.post('/death_counter', (req, res) => {
        const type = req.body['type'];
        if(type == "counter") {
            const mode = req.body['mode'], value = Number(req.body['value']);
            counter += (mode == 'increment')?value:-value;
            res.status(200).send({counter: counter});
        } else {
            res.status(406).send({message: `This ressource only accept "type: counter", not "type: ${type}"`});
        }
    })

    server.get('/config', (req, res) => {
        res.status(200).sendFile(path.join(__dirname, '..', 'static_pages', 'config', 'index.html'));
    })
    
    server.listen(port, "0.0.0.0", () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}