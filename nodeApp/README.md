# Sub-Project : Node.js App
## Description

This sub-project's purpose is to learn how to use HTML/CSS/Javascript to make a Node.js app.
Currently, it works like a local server to which requests can be sent.

Here is a list of currently requestable pages:
- death_counter : a counter changing color and size with the value
- config : nothing going on here, a relic of the past

## Usage

<!-- A Docker image containing the app is deployed at "ghcr.io/ziffuge/overlay-twitch" with each release.
See [How to Install](../README.md#how-to-install) for instructions. -->
The app can be run using commands. Either, by running with Node.js the entry point file :
`node dist/main.js` 
Or, 
`node dist/main.js -sp <port>`

The first option opens a terminal UI to manage local server creation. It is more user friendly.
The second option directly launch a local server. 

Note: You must open a `console` inside the app folder in order to use the commands above.

## Stream Deck Compatibility

The Elgato Stream Deck compatibility is handled by the other sub-project. 

## Typescript

In fact, this sub-project uses typescript and not javascript. This choice was made to integrate more rigour in the code. (And also just because I was curious)

## Terminal UI Quick Guide

The *terminal UI* is a very simple interface to manage server creation.
There are currently three panels: 
- Start
- Monitoring
- Exit
Use `UP` and `DOWN` arrows to choose and `ENTER` to select.

### Start

Choose a port number for the server. It will appear inside the URL (i.e. `http://localhost:<port>`).
Use `ENTER` to confirm and `ESC` to return to navigation.

### Monitoring

Displays basic info about all servers launched during the session.
Use `ESC` to return to navigation.

### Exit

Exit the app.
You can also do `CTRL+Q` anywhere in the UI to exit.

## Notes

- The name might be a bit silly
- Still a WIP, therefore the code might be nebulous