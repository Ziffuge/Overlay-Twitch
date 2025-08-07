import React from "react";
import { Box, useInput } from "ink";
export const ContentArea = ({ isFocused, onExit, children }) => {
    useInput((input, key) => {
        if (key.escape) {
            onExit();
        }
    });
    return (React.createElement(Box, { borderStyle: "round", borderColor: isFocused ? "yellow" : "white", width: "100%", height: "100%", paddingX: 3, paddingY: 1 }, children));
};
