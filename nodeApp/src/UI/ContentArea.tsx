import React from "react";
import { Box, useFocusManager, useInput } from "ink";

type CAProps = {
    isFocused: boolean;
    onExit: () => void;
    children: React.ReactNode[];
};

export const ContentArea : React.FC<CAProps> = ({isFocused, onExit, children}) => {

    useInput((input, key) => {
        if(key.escape) {
            onExit();
        }
    });

    return (<Box
    borderStyle={"round"}
    borderColor={isFocused?"yellow":"white"}
    width={"100%"}
    height={"100%"}
    paddingX={3}
    paddingY={1}>
        {children}
    </Box>);
};