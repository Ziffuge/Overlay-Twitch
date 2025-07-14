import { action, KeyDownEvent, SendToPluginEvent, SingletonAction, WillAppearEvent, streamDeck, DidReceiveSettingsEvent, ActionService } from "@elgato/streamdeck";

const debug = false;

@action({UUID: "com.ziffuge.zut.serverrequest"})
export class ServerRequest extends SingletonAction<ServerRequestSettings> {

    override onWillAppear(ev: WillAppearEvent<ServerRequestSettings>): Promise<void> | void {
        if(debug) {streamDeck.logger.debug('Registered a new action :', ev.action);}
        ev.action.getSettings();
    }

    override onDidReceiveSettings(ev: DidReceiveSettingsEvent<ServerRequestSettings>): Promise<void> | void {
        var settings: ServerRequestSettings = ev.payload.settings;
        this.isValidAddress(settings.address).then((patch) => {
            settings = {...settings, ...patch};
            ev.action.setSettings(settings);
        });
    }

    override onSendToPlugin(ev: SendToPluginEvent<ServerRequestSettings, ServerRequestSettings>): Promise<void> | void {
        const actionID = ev.action.id;
        const action = streamDeck.actions.find((a) => a.id == actionID);
        if(! ev.payload.isValidAddress) {
            ev.action.getSettings();
            streamDeck.logger.error("Unable to contact local server at:", ev.payload.address);
            ev.action.showAlert();
            return;
        }
        const { address, ...contextual } = ev.payload;
        this.post(address, {
                type: "counter",
                id: contextual.id,
                value: contextual.value,
                mode: contextual.mode,
        })
        .then(raw => raw as {"id": number, "value": number})
        .then(data => action?.setTitle(data.value.toString()));
    }

    override onKeyDown(ev: KeyDownEvent<ServerRequestSettings>): Promise<void> | void {
        if(! ev.payload.settings.isValidAddress) {
            ev.action.getSettings();
            streamDeck.logger.error("Unable to contact local server at:", ev.payload.settings.address);
            ev.action.showAlert();
            return;
        }
        const { address, ...contextual } = ev.payload.settings;
        this.post(address, {
                type: "counter",
                id: contextual.id,
                value: contextual.value,
                mode: contextual.mode,
        })
        .then(raw => raw as {"id": number, "value": number})
        .then(data => ev.action.setTitle(data.value.toString()));
    }

    private async post(address: string, payload: any): Promise<unknown> {
        return fetch(address, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            if(debug) {streamDeck.logger.debug('POST request :', JSON.stringify(payload), '; response :', data)}
            return data;
        })
        .catch(err => {
            streamDeck.logger.error(err);
        });
    }

    private async isValidAddress(address: string) {
        var counterID: number = -1;
        var isValid: boolean = false;
        await fetch(address, {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({"type": "counter-id", "from": "/" + address.split("/").slice(3).join("/") + "/"})
        })
        .then(response => response.json())
        .then(data => data as CounterIDResponse)
        .then(parsed => {
            counterID = parsed.id;
            isValid = true;
        })
        .catch(err => {
            streamDeck.logger.error("Unable to process data :", err);
        })
        return {"id": counterID, "isValidAddress": isValid};
    }
}

type ServerRequestSettings = {
    address: string,
    id: number,
    mode: string,
    value: number,
    isValidAddress: boolean,
};

type CounterIDResponse = {
    type: string,
    id: number,
    value: number,
}