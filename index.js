const express = require('express'); // load modules
const path = require('path');
const bodyParser = require('body-parser');
const app = express();           // reference to our server app
const port = 3000;

var counter = 0;

app.get('/', (req, res) => {
    res.send('Hello, Node.js!');
});

app.use(express.static(path.join(__dirname, 'death_counter')));

app.use(bodyParser.json());

app.get('/death_counter', (req, res) => {
    res.sendFile(path.join(__dirname, 'death_counter', 'index.html'));
});

app.post('/death_counter', (req, res) => {
    const {increment} = req.body;
    if(increment == 1) {
        counter++;
    }
    res.send({counter: counter});
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});