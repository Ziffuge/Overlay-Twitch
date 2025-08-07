import React from "react";
import { Box, Text, useFocus } from "ink";
import SelectInput from "ink-select-input";

export type MyItem = {
    value: string,
    label: string,
};

export type NavigationBarOptions = {
    navItems: Array<MyItem>;
    onSelect: (item: MyItem) => void;
    onHighlight: (item: MyItem) => void;
};

type CustomItemProps = {
    isSelected?: boolean;
    label: string;
}

type CustomIndicatorProps = {
    isSelected?: boolean;
}

const CustomItem : React.FC<CustomItemProps> = ({isSelected, label}) => (<Text color={(isSelected ?? false)?"yellow":"white"}>{label}</Text>);
const CustomIndicator : React.FC<CustomIndicatorProps> = ({isSelected}) => {
    if(isSelected) {
        return <Text color={"yellow"}>{">"}</Text>;
    } else {
        return <Text> </Text>;
    }
};

export const NavigationBar : React.FC<NavigationBarOptions> = ({navItems, onSelect, onHighlight}) => {
    const { isFocused } = useFocus({id: "select", autoFocus: true});

    return (<Box 
    borderStyle={"round"}
    borderColor={isFocused?"yellow":"white"}
    minWidth={30}
    width={'50%'}
    height={'100%'}
    flexDirection={"column"}
    paddingX={3}
    paddingY={1}
    >
        <Text bold>Navigation</Text>
        <SelectInput 
            items={navItems} 
            onSelect={onSelect} 
            onHighlight={onHighlight} 
            isFocused={isFocused} 
            indicatorComponent={CustomIndicator}
            itemComponent={CustomItem}
        />
    </Box>)
};