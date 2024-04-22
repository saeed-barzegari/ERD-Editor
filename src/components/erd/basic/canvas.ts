import {View} from "./view";
import {Point} from "./point";

export class Canvas {
    private static singleton: Canvas;
    private _resolution?: number;
    private _scale: number;
    private _context?: CanvasRenderingContext2D;
    private _root?: View;
    private _offset: Point;

    constructor() {
        this._offset = new Point(0, 0);
        this._scale = 1;
    }

    get offset(): Point {
        return this._offset;
    }

    set offset(value: Point) {
        this._offset = value;
    }

    get scale(): number {
        return <number>this._scale;
    }

    set scale(value: number) {
        this._scale = value;
    }

    get resolution(): number {
        return <number>this._resolution;
    }

    set resolution(value: number) {
        console.log(value)
        this._resolution = Math.max(1, value);
    }

    get ratio() {
        return this.resolution * this.scale;
    }

    get root(): View {
        return <View>this._root;
    }

    set root(value: View) {
        this._root = value;
    }

    public static getSingleton() {
        if (!Canvas.singleton)
            Canvas.singleton = new Canvas();
        return Canvas.singleton
    }

    setContext(context: CanvasRenderingContext2D) {
        this._context = context
        this.context.canvas.addEventListener('mousedown', event => this.root.mouseDown(Math.floor(event.offsetX / this.scale - this.offset.x), Math.floor(event.offsetY / this.scale - this.offset.y)))
        this.context.canvas.addEventListener('mouseup', event => this.root.mouseUp(event.offsetX / this.scale - this.offset.x, event.offsetY / this.scale - this.offset.y))
        this.context.canvas.addEventListener('click', event => this.root.click(event.offsetX / this.scale - this.offset.x, event.offsetY / this.scale - this.offset.y))
        this.context.canvas.addEventListener('mousemove', event => this.root.mouseMove(Math.floor(event.offsetX / this.scale - this.offset.x), Math.floor(event.offsetY / this.scale - this.offset.y)))
        this.context.canvas.addEventListener('wheel', event => this.root.wheel(Math.floor(event.offsetX / this.scale - this.offset.x), Math.floor(event.offsetY / this.scale - this.offset.y), event.deltaY))
        this.context.canvas.addEventListener('dblclick', event => this.root.dblClick(Math.floor(event.offsetX / this.scale - this.offset.x), Math.floor(event.offsetY / this.scale - this.offset.y)))
        return this
    }



    setResolution(ratio: number) {
        this.resolution = ratio;
        return this;
    }

    setScale(scale: number) {
        this.scale = scale;
        return this;
    }

    get context(): CanvasRenderingContext2D {
        return <CanvasRenderingContext2D>this._context;
    }

    setRoot(root: View) {
        this._root = root;
        return this;
    }
}