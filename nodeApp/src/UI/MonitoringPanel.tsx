import React from "react";
import { Table } from "./Table.js";
import { ChildProcess } from "child_process";

export enum ServerStatus {
    Up = "up",
    Down = "down",
    Error = "error",
    Pending = "pending",
}

export type ServerInstance = {
    process: ChildProcess;
    port: number;
    status?: ServerStatus;
    error?: string;         // Currently not used, should be set if status == "error"
};

export type MonitoringProps = {
    isFocused?: boolean;
    servers?: Array<ServerInstance>;
};

export const MonitoringPanel : React.FC<MonitoringProps> = ({isFocused, servers}) => {
    return (<Table 
        data={servers??[]} 
        columns={[
            {key: "pid", label:"PID", accessor: (r) => r.process.pid},
            {key: "port", label:"Port", accessor: (r) => r.port},
            {key: "address", label:"Address", accessor: (r) => ("http://localhost:" + r.port)},
            {key: "status", label:"Status", accessor: (r) => (r.status)},
        ]}>
    </Table>);
};