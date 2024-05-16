import {View} from "./view";
import {Element} from "./element";
import {isSelectable, Selectable} from "@/components/erd/basic/selectable";
import {Table} from "@/components/erd/table";
import {Point} from "@/components/erd/basic/point";

enum MouseAction {
    Select,
    Panning
}

export class Viewport extends View {
    mouseAction: MouseAction;
    selected: Selectable[];
    protected _scale: number;
    private _offset: Point;

    constructor(children: Element[] = []) {
        super(children);
        this.selected = [];
        this.mouseAction = MouseAction.Panning;
        this.mouseHandler();
        this._scale = 2;
        this._offset = new Point(0, 0);
    }

    layout() {
        this.children.forEach(child => child.layout())
        return
    }

    draw(context: CanvasRenderingContext2D) {
        super.draw(context);
        context.save()
        if (this.clip) {
            context.save();
            context.clip();
        }
        context.scale(this.scale, this.scale)
        context.translate(this.offset.x, this.offset.y)
        this.children.forEach(child => child.draw(context))
        if (this.clip) {
            context.restore();
        }
        context.restore();
    }

    mouseHandler() {
        //Panning
        let startX: number, startY: number;
        const mouseMoveListener = (x: number, y: number) => {
            if (this.mouseAction == MouseAction.Panning) {
                const changeX = (x - startX);
                const changeY = (y - startY);

                this.offset.add(changeX, changeY);
            } else if (this.mouseAction == MouseAction.Select) { // todo: implement
                this.selected = []
                this.children.forEach(child => {
                    if (isSelectable(child))
                        (child as Selectable).setSelected(true);
                })
            }
        }
        this.addListener('mousedown', (x: number, y: number) => {
            let hit = false;
            this.children.forEach(child =>{
                if(child.isInArea(x, y))
                    hit = true
            })
            if(hit) return;

            startX = x;
            startY = y;
            this.addListener('mousemove', mouseMoveListener)
        })
        this.addListener('mouseup', () => this.removeListener('mousemove', mouseMoveListener));

        //Zoom
        this.addListener('wheel', (x, y, deltaY) => {
            this.scale = Math.max(0.25, Math.min(4, this.scale + deltaY / 400));
        })
    }

    setMouseAction(mouseAction: MouseAction) {
        this.mouseAction = mouseAction;
        return this;
    }


    hasAnySelected(){
        return this.selected.length > 0;
    }

    getFirstSelected() {
        return this.selected.at(0) as Table;
    }

    get scale(): number {
        return this._scale;
    }

    set scale(value: number) {
        this._scale = value;
    }

    get offset(): Point {
        return this._offset;
    }

    set offset(value: Point) {
        this._offset = value;
    }

    mouseUp(x: number, y: number) {
        super.mouseUp(x/this.scale - this.offset.x, y/this.scale - this.offset.y);
    }
    mouseDown(x: number, y: number): boolean {
        return super.mouseDown(x/this.scale - this.offset.x, y/this.scale - this.offset.y);
    }

    mouseMove(x: number, y: number, overlay = false): boolean {
        return super.mouseMove(x/this.scale - this.offset.x, y/this.scale - this.offset.y, overlay);
    }

    click(x: number, y: number): boolean {
        return super.click(x/this.scale - this.offset.x, y/this.scale - this.offset.y);
    }
}