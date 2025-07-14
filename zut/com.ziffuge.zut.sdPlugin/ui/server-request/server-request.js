
const { streamDeckClient } = SDPIComponents;

async function pingPlugin() {
    const settings = await streamDeckClient.getSettings();
    const payload = settings.settings;
    streamDeckClient.send("sendToPlugin", payload);
}