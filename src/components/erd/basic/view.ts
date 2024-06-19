import {Element} from "@/components/erd/basic/element";
import {Size} from "@/components/erd/basic/size";
import {Point} from "@/components/erd/basic/point";

export abstract class View extends Element {
    children: Element[];
    clip: boolean;
    protected _scale: number;
    private _offset: Point;

    protected constructor(children: Element[]) {
        super();
        this.children = children;
        this.clip = false;
        this.children.forEach(child => {
            child.setParent(this)
        })
        this._scale = 1;
        this._offset = new Point(0, 0);
    }

    setClip(clip: boolean) {
        this.clip = clip;
        return this;
    }

    mouseDown(x: number, y: number) {
        if (this.isInArea(x, y))
            this.emit('mousedown', x, y);
        this.children.forEach(child => child.mouseDown(x/this.scale - this.offset.x, y/this.scale - this.offset.y))
    }

    mouseMove(x: number, y: number, overlay = false): boolean {
        let checkOverlay = overlay;
        const hit = super.mouseMove(x, y, overlay);
        for (let i = this.children.length - 1; i >= 0; i--) {
            checkOverlay = this.children[i].mouseMove(x/this.scale - this.offset.x, y/this.scale - this.offset.y, checkOverlay) || overlay;
        }
        return hit;
    }

    mouseUp(x: number, y: number) {
        super.mouseUP(x, y);
        this.children.forEach(child => child.mouseUP(x/this.scale - this.offset.x, y/this.scale - this.offset.y))
    }

    wheel(x:number, y:number, deltaY:number) {
        if (this.isInArea(x, y)) {
            this.emit('wheel', x, y, deltaY);
            this.children.forEach(child => {
                if (child instanceof View) child.wheel(x/this.scale - this.offset.x, y/this.scale - this.offset.y, deltaY)
            })
        }
    }

    click(x: number, y: number): boolean {
        let hit = false;
        for (let i = this.children.length - 1; i >= 0; i--) {
            hit = this.children[i].click(x/this.scale - this.offset.x, y/this.scale - this.offset.y);
            if(hit)
                return hit;
        }
        return super.click(x, y);
    }

    dblClick(x:number, y:number){
        let hit = false;
        for (let i = this.children.length - 1; i >= 0; i--) {
            hit = this.children[i].dblClick(x/this.scale - this.offset.x, y/this.scale - this.offset.y);
            if(hit)
                return hit;
        }
        return super.dblClick(x, y);
    }

    addChild(element: Element) {
        this.children.push(element);
        element.parent = this;
        return this;
    }

    convertLocalPositionToGlobal(pos:Point){
        return pos.addPoint(this.offset).mul(this.scale);
    }

    convertGlobalPositionToLocal(pos:Point){
        return pos.div(this.scale).subPoint(this.offset);
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
}