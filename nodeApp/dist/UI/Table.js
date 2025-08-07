import { Box, measureElement, Text } from "ink";
import React, { useEffect, useRef, useState } from "react";
const Cell = ({ content, height, width }) => {
    const upperLeftStyle = {
        topLeft: '┌',
        top: '─',
        topRight: '┐',
        left: '│',
        bottomLeft: '└',
        bottom: '─',
        bottomRight: '┘',
        right: '│'
    };
    return React.createElement(Box, { height: height, width: width + 2, borderStyle: upperLeftStyle },
        React.createElement(Text, null, content));
};
function Row({ data, columns, columnsWidths }) {
    return (React.createElement(Box, null, columns.map((col, i) => (React.createElement(Cell, { content: col.accessor(data)?.toString() ?? "undefined", width: columnsWidths[col.key] })))));
}
;
function HeaderRow({ columns, columnsWidths }) {
    return (React.createElement(Box, null, columns.map((col) => (React.createElement(Cell, { content: col.label, width: columnsWidths[col.key] })))));
}
export function Table({ data, columns }) {
    const ref = useRef(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    useEffect(() => {
        if (ref.current) {
            const size = measureElement(ref.current);
            setWidth(size.width);
            setHeight(size.height);
        }
    });
    // Precompute cell content
    let columnsWidths = Object.fromEntries(columns.map((col) => {
        let width = col.label.length;
        for (const r of data) {
            width = Math.max(width, col.accessor(r).toString().length);
        }
        return [col.key, width];
    }));
    return (React.createElement(Box, { ref: ref, width: '100%', height: '100%', flexDirection: "column" },
        (width && height) ? React.createElement(HeaderRow, { columns: columns, columnsWidths: columnsWidths }) : React.createElement(React.Fragment, null),
        (width && height) ? data.map((row) => React.createElement(Row, { data: row, columns: columns, columnsWidths: columnsWidths })) : React.createElement(Text, null, "Loading...")));
}
