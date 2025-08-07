import React from "react";
import { Table } from "./Table.js";
export var ServerStatus;
(function (ServerStatus) {
    ServerStatus["Up"] = "up";
    ServerStatus["Down"] = "down";
    ServerStatus["Error"] = "error";
    ServerStatus["Pending"] = "pending";
})(ServerStatus || (ServerStatus = {}));
export const MonitoringPanel = ({ isFocused, servers }) => {
    return (React.createElement(Table, { data: servers ?? [], columns: [
            { key: "pid", label: "PID", accessor: (r) => r.process.pid },
            { key: "port", label: "Port", accessor: (r) => r.port },
            { key: "address", label: "Address", accessor: (r) => ("http://localhost:" + r.port) },
            { key: "status", label: "Status", accessor: (r) => (r.status) },
        ] }));
};
