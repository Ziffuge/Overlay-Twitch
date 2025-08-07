import React, { useState } from "react";
import { Box, Text } from "ink";
import { InputText } from "./InputText.js";
import { ServerStatus } from "./MonitoringPanel.js";

type SMProps = {
    onSubmit?: (input: string) => Promise<ServerStatus>;
    isFocused?: boolean;
};

export const StartMenu : React.FC<SMProps> = ({onSubmit, isFocused}) => {
    const inputBorderColor = isFocused? "yellow":"white";
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [status, setStatus] = useState<ServerStatus | null>(null);

    return (<Box flexDirection="column" width={"100%"}>
        <Text>Choose an unused port number (range from 49152 to 65535):</Text>
        <Box width={"100%"} borderStyle={"single"} borderColor={inputBorderColor}>
            <InputText isFocused={isFocused ?? false} onSubmit={async (value: string) => {
                if(onSubmit){
                    setSubmitted(true);
                    setStatus(ServerStatus.Pending);
                    try {
                        const result = await onSubmit(value);
                        setStatus(result);
                    } catch {
                        setStatus(ServerStatus.Error);
                    }
                }
            }} 
            value=""></InputText>
        </Box>
        {submitted && status == null && <Text>unknown</Text>}
        {submitted && status == ServerStatus.Pending && <Text>Starting the server...</Text>}
        {submitted && status == ServerStatus.Error && <Text color={"red"}>Failed to start server with designated port</Text>}
        {submitted && status == ServerStatus.Up && <Text color={"green"}>Succesfully started the server</Text>}
    </Box>);
};