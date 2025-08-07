import React, { JSX, ReactNode, useEffect, useState } from "react";
import { useInput, Text, Box, useApp, useFocus, useFocusManager } from "ink";
import { withFullScreen } from "fullscreen-ink";
import { spawn } from "child_process";
import { MyItem, NavigationBar } from "./UI/NavigationBar.js";
import { ContentArea } from "./UI/ContentArea.js";
import { StartMenu } from "./UI/StartMenu.js";
import { MonitoringPanel, ServerInstance, ServerStatus } from "./UI/MonitoringPanel.js";

type NavigationOption = {
    item: MyItem,
    panel: (isFocused: boolean) => JSX.Element,
    description?: ReactNode,
};

const App: React.FC = () => {

    const [isNavigating, setIsNavigating] = useState(true);
    const {isFocused} = useFocus({id:"content"});
    const focusManager = useFocusManager();
    
    const [servers, setServers] = useState(Array<ServerInstance>);
    const CreateServer = async (port: string) : Promise<ServerStatus> => {
        return new Promise((resolve, reject) => {

            const args = ['./dist/main.js', '--server', '--port', port];
            const newProcess = spawn(process.execPath, args, {stdio: ["ignore", "ignore", "ignore"]});
            const index: number = servers.length; 
    
            setServers(servers => [...servers, {process: newProcess, port: Number(port)} as ServerInstance]);
            
            // Callback in case of failure of the spawn
            newProcess.on("error", () => {setServers(prev => {
                const updated = [...prev];
                updated[index].status = ServerStatus.Error;
                resolve(ServerStatus.Error);
                return updated;
            })});
    
            // Callback in case of success of the spawn
            newProcess.on("spawn", () => {setServers(prev => {
                const updated = [...prev];
                updated[index].status = ServerStatus.Up;
                resolve(ServerStatus.Up);
                return updated;
            })});
        });
    };

    const exit = () => {
        servers.forEach((p) => p.process.kill());
        process.exit(0);
    }; //useApp();

    const navOpt: NavigationOption[] = [
        {
            item: {"label": "Start", "value": "start"}, 
            panel: (isFocused: boolean) => (<StartMenu isFocused={isFocused} onSubmit={CreateServer}/>),
            description: <Text>Configure and start a new local server.</Text>
        },
        {
            item: {"label": "Monitoring", "value": "monitoring"},
            panel: (isFocused: boolean) => (<MonitoringPanel isFocused={isFocused} servers={servers}/>),
            description: <Text>WIP</Text>
        },
        {
            item: {"label": "Exit", "value": "exit"},
            panel: () => (<></>),
            description: <Text>Press Enter to exit</Text>
        },
    ];
    const navItems: MyItem[] = navOpt.map(o => o.item);
    const [currentNavItem, setCurrentNavItem] = useState(navOpt[0]);
    const [hlNavItem, setHLNavItem] = useState(navOpt[0]);


    const onNavItemSelected = (item: MyItem) => {
        if (item.value === 'exit') {
            exit();
        } else {
            setIsNavigating(false);
            focusManager.focusNext();
            setCurrentNavItem(navOpt.find(o => o.item == item)!);
        }
    };

    const onNavItemHL = (item: MyItem) => {
        setHLNavItem(navOpt.find(o => o.item == item)!);
    }


    // Changes the name of the session
    useEffect(() => {
        process.stdout.write("\x1b]0;Local Server Manager\x07");
        focusManager.enableFocus();
    });

    // Universal Controls
    useInput((input, key) => {
        if(key.ctrl && input == "q") {
            exit();
        }
    });

    return (
        <Box width={'100%'} flexDirection="column">
            <Text> </Text>
            <Box height={'100%'} flexDirection="row">
                <NavigationBar navItems={navItems} onSelect={onNavItemSelected} onHighlight={onNavItemHL}/>
                <ContentArea isFocused={isFocused} onExit={focusManager.focusNext}>
                    {isNavigating && hlNavItem.description}
                    {(! isNavigating) && currentNavItem.panel(isFocused)}
                </ContentArea>
            </Box>
        </Box>
    );
};

export const launchUI = () => {
    withFullScreen(<App />).start();
}