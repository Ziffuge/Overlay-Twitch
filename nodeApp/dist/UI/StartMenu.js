import React, { useState } from "react";
import { Box, Text } from "ink";
import { InputText } from "./InputText.js";
import { ServerStatus } from "./MonitoringPanel.js";
export const StartMenu = ({ onSubmit, isFocused }) => {
    const inputBorderColor = isFocused ? "yellow" : "white";
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState(null);
    return (React.createElement(Box, { flexDirection: "column", width: "100%" },
        React.createElement(Text, null, "Choose an unused port number (range from 49152 to 65535):"),
        React.createElement(Box, { width: "100%", borderStyle: "single", borderColor: inputBorderColor },
            React.createElement(InputText, { isFocused: isFocused ?? false, onSubmit: async (value) => {
                    if (onSubmit) {
                        setSubmitted(true);
                        setStatus(ServerStatus.Pending);
                        try {
                            const result = await onSubmit(value);
                            setStatus(result);
                        }
                        catch {
                            setStatus(ServerStatus.Error);
                        }
                    }
                }, value: "" })),
        submitted && status == null && React.createElement(Text, null, "unknown"),
        submitted && status == ServerStatus.Pending && React.createElement(Text, null, "Starting the server..."),
        submitted && status == ServerStatus.Error && React.createElement(Text, { color: "red" }, "Failed to start server with designated port"),
        submitted && status == ServerStatus.Up && React.createElement(Text, { color: "green" }, "Succesfully started the server")));
};
