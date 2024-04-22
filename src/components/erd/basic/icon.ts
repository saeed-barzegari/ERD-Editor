import {Element} from "./element";

export class Icon extends Element{
    protected path:string;
    constructor(path:string) {
        super();
        this.path = path;
    }

    layout() {

    }
}