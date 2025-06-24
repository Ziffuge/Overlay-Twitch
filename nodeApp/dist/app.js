"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const arg1 = process.argv.at(2);
const port = (arg1 == undefined) ? 3000 : Number(arg1);
(0, server_1.startServer)(port);
