import { startServer } from "./server";

const arg1: string | undefined = process.argv.at(2);
const port: number = (arg1 == undefined)?3000:Number(arg1);

startServer(port);