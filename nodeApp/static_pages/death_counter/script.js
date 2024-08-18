// * config values
const upKey = ")";
const downKey = "-";
const levels = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 75, 100];
const nLevel = levels.length;
const iColor = {r:255, g:255, b:255};
const fColor = {r:196, g:15, b:15};
const gradientCoef = Array.from({length: nLevel}, (_, i) => i/(nLevel-1));
const localhostOn = true; // change to false if index.html is used as standalone file

// * init values
var currentCount = 0;
var nextLevel = 1;
var counter = document.querySelector("#deathCounter");

var fetchingCounter = function() {
    fetch('http://localhost:3000/death_counter', {
            method:'POST',
            headers: {"Content-type": "application/json"},
            body:JSON.stringify({ type: "counter", mode:"increment", value:0})
    })
    .then(response => response.json())
    .then(parsedResult => currentCount = parsedResult['counter'])
    .then(() => {
        counter.innerHTML = currentCount.toString();
        applyStyle();
    })
    .catch(_ => console.log("Something went wrong, make sure the server is running"));
};

var updateLevel = function () {
    if (currentCount < levels[nextLevel-1]) {
        nextLevel--;
        return true;
    } else if (currentCount >= levels[nextLevel]) {
        nextLevel++;
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

if(localhostOn) {
    setInterval(fetchingCounter, 5000);
}

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
    } else {
        console.log(event.key);
    }
});