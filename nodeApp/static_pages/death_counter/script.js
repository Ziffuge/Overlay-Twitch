// * config values
const upKey = ")";
const downKey = "-";
const levels = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const nLevel = levels.length;
const iColor = {r:255, g:255, b:255};
const fColor = {r:196, g:15, b:15};
const gradientCoef = Array.from({length: nLevel}, (_, i) => i/(nLevel-1));
const localhostOn = true; // change to false if index.html is used as standalone file

// * init values
var currentCount = 0;
var nextLevel = 1;
var counter = document.querySelector("#deathCounter");
var counter_id = -1;

var fetchingCounter = function() {
    socket.send(JSON.stringify({"type": "counter", "id": counter_id, "value": 1, "mode": "increment"}));
};


// * Handle style updates of the counter
var updateLevel = function () {
    if (currentCount < levels[nextLevel-1]) {
        nextLevel--;
        updateLevel();
        return true;
    } else if (currentCount >= levels[nextLevel]) {
        nextLevel++;
        updateLevel();
        return true;
    }
    return false;
}

var gradientColor = function() {
    var red = iColor.r + (fColor.r-iColor.r)*gradientCoef[nextLevel-1];
    var green = iColor.g + (fColor.g-iColor.g)*gradientCoef[nextLevel-1];
    var blue = iColor.b + (fColor.b-iColor.b)*gradientCoef[nextLevel-1];
    return {r:red, g:green, b:blue};
}

var applyStyle = function () {
    if (updateLevel()) {
        var color = gradientColor();
        counter.style.color = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')'; //colorPalette['#'+nextLevel.toString()];
        counter.style.fontSize = (50 + 2*(nextLevel - 1)).toString() + "px";
    }
}

// * Handle "web browser" keyboard actions
document.addEventListener("keydown", function (event) {
    if (event.key === upKey) {
        currentCount++;
        counter.innerHTML = currentCount.toString();
        applyStyle();
    } else if (event.key === downKey) {
        currentCount--;
        counter.innerHTML = currentCount.toString();
        applyStyle();
    } else if (localhostOn && event.key === " ") {
        fetchingCounter();
    }
});

// * WebSocket Client
const host = window.location.hostname;
const port = window.location.port;
const socketURL = `ws://${host}:${port}`;
const socket = new WebSocket(socketURL);

socket.onopen = () => { 
    console.log('Connected to the WebSocket server');
};

socket.onmessage = (message) => { 
    const data = JSON.parse(message.data);
    if(data.type === 'counter') {
        if(data.id === counter_id) {
            currentCount = data.value;
            counter.innerHTML = currentCount.toString();
            applyStyle();
        }
    } else if(data.type === 'counter-id') {
        counter_id = data.id;
        currentCount = data.value;
        counter.innerHTML = currentCount.toString();
        applyStyle();
    } else if(data.type === 'connection') {
        console.log('Connection status :', data.status);
        socket.send(JSON.stringify({"type": "counter-id", "from": window.location.pathname}));
    } else {
        console.log('Received:', message.data);
    }
};

socket.onclose = () => { 
    socket.close(1000);
    console.log('Disconnected from the WebSocket server');
};