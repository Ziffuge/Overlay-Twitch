export class Counter {
    private _value: number;
    private _file: string;

    constructor(file: string) {
        this._value = 0;
        this._file = file;
    }
    
    public get value() : number {
        return this._value;
    }
    
    public get file() : string {
        return this._file;
    }

    public set value(v : number) {
        this._value = v;
    }
    
}