import React from "react";
import { Box, Text, useFocus } from "ink";
import SelectInput from "ink-select-input";
const CustomItem = ({ isSelected, label }) => (React.createElement(Text, { color: (isSelected ?? false) ? "yellow" : "white" }, label));
const CustomIndicator = ({ isSelected }) => {
    if (isSelected) {
        return React.createElement(Text, { color: "yellow" }, ">");
    }
    else {
        return React.createElement(Text, null, " ");
    }
};
export const NavigationBar = ({ navItems, onSelect, onHighlight }) => {
    const { isFocused } = useFocus({ id: "select", autoFocus: true });
    return (React.createElement(Box, { borderStyle: "round", borderColor: isFocused ? "yellow" : "white", minWidth: 30, width: '50%', height: '100%', flexDirection: "column", paddingX: 3, paddingY: 1 },
        React.createElement(Text, { bold: true }, "Navigation"),
        React.createElement(SelectInput, { items: navItems, onSelect: onSelect, onHighlight: onHighlight, isFocused: isFocused, indicatorComponent: CustomIndicator, itemComponent: CustomItem })));
};
