import express from "express";
import path from "path";
import bodyParser from "body-parser";

export function startServer() {
    const server = express();
    const port: number = 3000;
    var counter: number = 0;
    
    server.get('/', (req, res) => {
        res.send('Hello, Node.js!');
    });
    
    server.use(express.static(path.join(__dirname, '..', 'static_pages', 'death_counter')));
    
    server.use(bodyParser.json());
    
    server.get('/death_counter', (req, res) => {
        res.sendFile(path.join(__dirname, '..', 'static_pages','death_counter', 'index.html'));
    });
    
    server.post('/death_counter', (req, res) => {
        const {increment} = req.body;
        if(increment == 1) {
            counter++;
        }
        res.send({counter: counter});
    })
    
    server.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}