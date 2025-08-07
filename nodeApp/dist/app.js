import React, { useEffect, useState } from "react";
import { useInput, Text, Box, useFocus, useFocusManager } from "ink";
import { withFullScreen } from "fullscreen-ink";
import { spawn } from "child_process";
import { NavigationBar } from "./UI/NavigationBar.js";
import { ContentArea } from "./UI/ContentArea.js";
import { StartMenu } from "./UI/StartMenu.js";
import { MonitoringPanel, ServerStatus } from "./UI/MonitoringPanel.js";
const App = () => {
    const [isNavigating, setIsNavigating] = useState(true);
    const { isFocused } = useFocus({ id: "content" });
    const focusManager = useFocusManager();
    const [servers, setServers] = useState((Array));
    const CreateServer = async (port) => {
        return new Promise((resolve, reject) => {
            const args = ['./dist/main.js', '--server', '--port', port];
            const newProcess = spawn(process.execPath, args, { stdio: ["ignore", "ignore", "ignore"] });
            const index = servers.length;
            setServers(servers => [...servers, { process: newProcess, port: Number(port) }]);
            // Callback in case of failure of the spawn
            newProcess.on("error", () => {
                setServers(prev => {
                    const updated = [...prev];
                    updated[index].status = ServerStatus.Error;
                    resolve(ServerStatus.Error);
                    return updated;
                });
            });
            // Callback in case of success of the spawn
            newProcess.on("spawn", () => {
                setServers(prev => {
                    const updated = [...prev];
                    updated[index].status = ServerStatus.Up;
                    resolve(ServerStatus.Up);
                    return updated;
                });
            });
        });
    };
    const exit = () => {
        servers.forEach((p) => p.process.kill());
        process.exit(0);
    }; //useApp();
    const navOpt = [
        {
            item: { "label": "Start", "value": "start" },
            panel: (isFocused) => (React.createElement(StartMenu, { isFocused: isFocused, onSubmit: CreateServer })),
            description: React.createElement(Text, null, "Configure and start a new local server.")
        },
        {
            item: { "label": "Monitoring", "value": "monitoring" },
            panel: (isFocused) => (React.createElement(MonitoringPanel, { isFocused: isFocused, servers: servers })),
            description: React.createElement(Text, null, "WIP")
        },
        {
            item: { "label": "Exit", "value": "exit" },
            panel: () => (React.createElement(React.Fragment, null)),
            description: React.createElement(Text, null, "Press Enter to exit")
        },
    ];
    const navItems = navOpt.map(o => o.item);
    const [currentNavItem, setCurrentNavItem] = useState(navOpt[0]);
    const [hlNavItem, setHLNavItem] = useState(navOpt[0]);
    const onNavItemSelected = (item) => {
        if (item.value === 'exit') {
            exit();
        }
        else {
            setIsNavigating(false);
            focusManager.focusNext();
            setCurrentNavItem(navOpt.find(o => o.item == item));
        }
    };
    const onNavItemHL = (item) => {
        setHLNavItem(navOpt.find(o => o.item == item));
    };
    // Changes the name of the session
    useEffect(() => {
        process.stdout.write("\x1b]0;Local Server Manager\x07");
        focusManager.enableFocus();
    });
    // Universal Controls
    useInput((input, key) => {
        if (key.ctrl && input == "q") {
            exit();
        }
    });
    return (React.createElement(Box, { width: '100%', flexDirection: "column" },
        React.createElement(Text, null, " "),
        React.createElement(Box, { height: '100%', flexDirection: "row" },
            React.createElement(NavigationBar, { navItems: navItems, onSelect: onNavItemSelected, onHighlight: onNavItemHL }),
            React.createElement(ContentArea, { isFocused: isFocused, onExit: focusManager.focusNext },
                isNavigating && hlNavItem.description,
                (!isNavigating) && currentNavItem.panel(isFocused)))));
};
export const launchUI = () => {
    withFullScreen(React.createElement(App, null)).start();
};
