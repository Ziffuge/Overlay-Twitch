/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const debug = true;

const sendRequest = new Action('com.github.ziffuge.serverrequest');

var actions = {};

function logError(err) {
	$SD.logMessage({message: err, context: actions}.stringify());
};

function post(address, payload) {
	fetch(address, {
		method: "POST",
		headers: {"Content-type": "application/json"},
		body: JSON.stringify(payload)
	})
	.then(response => response.json())
	.then(data => {if(debug) {console.log('POST request response :', data);}})
	.catch(err => logError(err));
};

/**
* The first event fired when Stream Deck starts
*/
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	if(debug) {console.log('Stream Deck connected!');}
});

sendRequest.onWillAppear(({ action, context, device, event, payload }) => {
	if(debug) {console.log('Registered a new action :', action);}
	
	actions[action] = {
		logged: true, 
		settings: $SD.getSettings(context)
	};
});

sendRequest.onSendToPlugin(({ action, context, device, event, payload }) => { //* used to simulate keyPress through Property Inspector
	if(debug) {console.log("received from PI", payload);}
	
	const { address, type, ...contextual } = payload;
	if(type === "counter") {
		post(address, {
			type: type,
			mode: contextual.mode,
			value: contextual.value
		});
	} else if(type === "other") {
		post(address, {
			type: type,
			info: contextual.more
		});
	}
});

sendRequest.onKeyUp(({ action, context, device, event, payload }) => {
	console.log("How the fuck did that triggered ?!!");
});
