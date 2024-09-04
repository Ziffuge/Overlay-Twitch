
# Stream Deck Custom Plugin

## Description

This plugin allows to interact with the other subproject's local server directly with a stream deck.

## Actions

### Server Request
Allows user to send predefined custom requests to the local server.
Parameters:
- Address: The address of the custom page (i.e. http://localhost:HOST_PORT/PAGE_NAME)
- Mode:    Weither it adds up or subtract to the counter
- Value:   The value by which the counter is changed
Button:
- Simulate keyDown: Press to simulate the press on the Stream Deck button

## Download

I am using the DistributionTool provided by Elgato (see [Plugin Packaging](https://docs.elgato.com/sdk/plugins/packaging)).
You can simply download the plugin installer in the Release tab of this repository. Or you can build yourself the plugin using the tool above.

## Dependencies

Uses the Elgato SDK. I also used the provided template, which I currently haven't totally cleaned so there might be unused file or assets.

## Credits

Custom Category Icon:
- Icon by SVG Repo is licensed under CC0. No copyrights.

Server Request Icon:
- Icon by Dazzle UI is licensed under CC BY 4.0. Changes were made to the original (mainly color).
