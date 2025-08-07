import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

type InputTextProps = {
    isFocused: boolean;
    onSubmit: (value: string) => void;
    value: string;
    regex?: string;
}

export const InputText : React.FC<InputTextProps> = ({isFocused, onSubmit, value, regex}) => {

    const [currentInput, setCurrentInput] = useState("");
    const validationPatternSize: RegExp = /^.{5}$/i;
    const validationPatternDigit: RegExp = /^[0-9]*$/i;
    const validate = (input: string) => (validationPatternDigit.test(input) && validationPatternSize.test(input));

    useInput((input, key) => {
        if(!isFocused) return;
        if(key.backspace) {
            setCurrentInput(currentInput.slice(0, -1));
        } else if(key.return && validate(currentInput)) {
            onSubmit(currentInput);
        } else {
            setCurrentInput(currentInput + input);
        }
    });

    return (<Box minHeight={1} flexDirection="column">
        <Text>{currentInput}</Text>
        {currentInput != "" && !validationPatternDigit.test(currentInput) && <Text color={"red"}>* Only digits are allowed!</Text>}
        {currentInput != "" && !validationPatternSize.test(currentInput) && <Text color={"red"}>* Make sure to have 5 digits!</Text>}
    </Box>);
};