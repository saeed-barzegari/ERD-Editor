import {EventEmitter} from "events";

export class State<T> extends EventEmitter{
    private _value:T;

    constructor(value:T) {
        super();
        this._value = value;
    }
    get value(): T {
        return this._value;
    }

    set value(value: T) {
        this._value = value;
        this.emit('change', value)
    }
}