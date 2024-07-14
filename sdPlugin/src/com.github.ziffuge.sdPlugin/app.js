/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const sendRequest = new Action('com.github.ziffuge.sendRequest');

/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	console.log('Stream Deck connected!');
});

sendRequest.onKeyUp(({ action, context, device, event, payload }) => {
	console.log('sendRequest !');
});

sendRequest.onDialRotate(({ action, context, device, event, payload }) => {
	console.log('Your dial code goes here!');
});
