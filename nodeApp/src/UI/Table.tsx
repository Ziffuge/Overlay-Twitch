import { Box, measureElement, Text } from "ink";
import React, { useEffect, useRef, useState } from "react";

type borderStyle = {
    topLeft: string, 
    top: string, 
    topRight: string, 
    left: string, 
    bottomLeft: string,
    bottom: string,
    bottomRight: string,
    right: string
}

type CellProps = {
    content: string,
    width: number,
    height?: number,
}

const Cell : React.FC<CellProps> = ({content, height, width}) => {

    const upperLeftStyle : borderStyle = {
        topLeft: '┌',
        top: '─',
        topRight: '┐',
        left: '│',
        bottomLeft: '└',
        bottom: '─',
        bottomRight: '┘',
        right: '│'
    };

    return <Box height={height} width={width + 2} borderStyle={upperLeftStyle}>
        <Text>{content}</Text>
    </Box>;
};

type RowProps<T> = {
    data: T,
    columns: Column<T>[],
    columnsWidths: Record<string, number>,
};

function Row<T>({data, columns, columnsWidths}: RowProps<T>) {
    return (<Box>
        {columns.map((col, i) => (<Cell content={col.accessor(data)?.toString()??"undefined"} width={columnsWidths[col.key]}></Cell>))}
    </Box>);
};

type HeaderRowProps<T> = {
    columns: Column<T>[],
    columnsWidths: Record<string, number>,
};

function HeaderRow<T>({columns, columnsWidths}: HeaderRowProps<T>) {
    return (<Box>
        {columns.map((col) => (<Cell content={col.label} width={columnsWidths[col.key]}></Cell>))}
    </Box>);
}

type Column<T> = {
    key: string;
    label: string;
    accessor: (row: T) => string | number | undefined;
}

type TableProps<T> = {
    data: Array<T>;
    columns: Column<T>[];
};

export function Table<T>({data, columns}: TableProps<T>) {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if(ref.current) {
            const size = measureElement(ref.current);
            setWidth(size.width);
            setHeight(size.height);
        }
    });

    // Precompute cell content
    let columnsWidths = Object.fromEntries(
        columns.map((col) => {
            let width = col.label.length;
            for(const r of data) {
                width = Math.max(width, col.accessor(r)!.toString().length);
            }
            return [col.key, width];
        })
    );

    return (<Box ref={ref} width={'100%'} height={'100%'} flexDirection="column">
        {/*Header*/}
        {(width && height) ? <HeaderRow columns={columns} columnsWidths={columnsWidths}></HeaderRow> : <></>}
        {/*Content*/}
        {(width && height) ? data.map((row) => 
            <Row data={row} columns={columns} columnsWidths={columnsWidths}></Row>
        ) : <Text>Loading...</Text>}
    </Box>);
}