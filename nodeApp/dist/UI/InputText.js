import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
export const InputText = ({ isFocused, onSubmit, value, regex }) => {
    const [currentInput, setCurrentInput] = useState("");
    const validationPatternSize = /^.{5}$/i;
    const validationPatternDigit = /^[0-9]*$/i;
    const validate = (input) => (validationPatternDigit.test(input) && validationPatternSize.test(input));
    useInput((input, key) => {
        if (!isFocused)
            return;
        if (key.backspace) {
            setCurrentInput(currentInput.slice(0, -1));
        }
        else if (key.return && validate(currentInput)) {
            onSubmit(currentInput);
        }
        else {
            setCurrentInput(currentInput + input);
        }
    });
    return (React.createElement(Box, { minHeight: 1, flexDirection: "column" },
        React.createElement(Text, null, currentInput),
        currentInput != "" && !validationPatternDigit.test(currentInput) && React.createElement(Text, { color: "red" }, "* Only digits are allowed!"),
        currentInput != "" && !validationPatternSize.test(currentInput) && React.createElement(Text, { color: "red" }, "* Make sure to have 5 digits!")));
};
