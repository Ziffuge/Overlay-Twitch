# Twitch Overlays

## Description

This project has the double purpose of learning and providing an useful app.

The learning part consists of using HTML/CSS/Javascript for a Node.js app.

The "useful" part consists of creating custom web pages that are displayable by OBS. It also includes an SDKPlugin (see [Elgato's Plugin Template](https://github.com/elgatosf/streamdeck-plugin-template)) for simplier and more practical interactions.

More details in the respective sub-projects' READMEs.

## Structure

This project is divided in two subprojects. Those two subprojects are tightly coupled henceforth explaining why they are part of the same repository.

The first one is a Node.js application whose purpose is to run a local server. This local server allow to display custom HTML/CSS pages on OBS.

The second one is an SDK plugin which allows interactivity with the local server directly from an Elgato Stream Deck.

Unfortunately the subprojects are unusable on their own.

## How to Install

**Node.js App**:
<!-- - install Docker or [Docker Desktop](https://www.docker.com/products/docker-desktop/) (recommended)
- launch the Docker app
- launch a *console* (depending on your OS) :
    - Windows -> Windows Powershell
    - Linux -> Bash
    - MacOS -> Console

If you haven't linked your accounts on Github and Docker first do in the *console*:
- `docker login ghcr.io -u YOUR_GITHUB_USERNAME -p YOUR_PERSONAL_ACCESS_TOKEN` 
Then:
- `docker pull ghcr.io/ziffuge/overlay-twitch:latest`

To confirm, just go on the *Docker Desktop App* and you should see in the *images* tab "ghcr.io/ziffuge/overlay-twitch". -->
To launch the app, you'll need the *distribution code* as well as *Node.js*.

### Node.js
To install *Node.js*, download the installer for your operating system (Linux, MacOS, Windows) at [Node.js Download](https://nodejs.org/en/download) and follow the instructions of the installer.
Or you can follow a tutorial found on the internet.

### Distribution Code
Now you'll need to download the files provided in the last release. The provided zip file contains two major parts:
1) the Node.js app
2) the stream deck plugin

First you'll need to *extract* the content of the zip file. Then put the `nodeApp` folder and all its content where you want to store the app. You can rename the main folder for clarity but not the sub-folders.
Once the app is at the desired location, you'll need to open a *console* inside the app folder. 
For Windows users, while inside the *file explorer* you can simply right click on the desired folder and select `open in terminal`. This should open a *console* with the path `C:\Users\...\nodeApp` or something similar. The most important is that the path ends with `\nodeApp`.
Now you simply need to execute the command `npm install` which will install all the necessary dependencies inside a `node_modules` folder according to the content of the `package.json` file.
The app should be succesfully installed, see [Usage](./nodeApp/README.md#usage) to know how to launch the app.

**SDKPlugin**:
- look at the last release of this repository
- download the *com.ziffuge.zut.streamDeckPlugin* file
- execute the file to install the plugin

## How to Launch the App

To launch the app:
<!-- - Open the *Docker Desktop App*
- Go in the *images* tab and run the image containing the app (*ghcr.io/ziffuge/overlay-twitch*)
- In the *Optional Settings* add the "Host Port" $3000$ (or other if you know what your doing). This is the port at which the app will be accessible. Namely "http://localhost:HOST_PORT" (carefull the console will display the adress with $3000$ despite any changes)
- The app is accessible from any browser, see more in nodeApp/README.md -->
- Open a *console* inside the app folder
- Run the command `node dist/main.js` 
- Navigate the terminal UI to manage servers (see [Quick Guide](./nodeApp/README.md#terminal-ui-quick-guide) for navigation)

## Build

If you, for whatever reason, want to build yourself this project.
The *Dockerfile* is provided with the project. Don't forget to install and build npm. For the plugin, simply follow the instructions given at [Stream Deck SDK Packaging](https://docs.elgato.com/streamdeck/sdk/guides/distribution#package).
