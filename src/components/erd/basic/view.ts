import {Element} from "@/components/erd/basic/element";
import {Size} from "@/components/erd/basic/size";

export abstract class View extends Element {
    children: Element[];
    clip: boolean;

    protected constructor(children: Element[]) {
        super();
        this.children = children;
        this.clip = false;
        this.children.forEach(child => {
            child.setParent(this)
        })
    }

    setClip(clip: boolean) {
        this.clip = clip;
        return this;
    }

    mouseDown(x: number, y: number): boolean {
        const hit = super.mouseDown(x, y);
        if (hit)
            for (let i = this.children.length - 1; i >= 0; i--) {
                if (this.children[i].mouseDown(x, y))
                    break;
            }
        return hit;
    }

    mouseMove(x: number, y: number, overlay = false): boolean {
        let checkOverlay = overlay;
        const hit = super.mouseMove(x, y, checkOverlay)
        for (let i = this.children.length - 1; i >= 0; i--) {
            checkOverlay = this.children[i].mouseMove(x, y, checkOverlay) || overlay;
        }
        return hit;
    }

    mouseUp(x: number, y: number) {
        super.mouseUP(x, y);
        this.children.forEach(child => child.mouseUP(x,y))
    }

    wheel(x:number, y:number, deltaY:number) {
        if (this.isInArea(x, y)) {
            this.emit('wheel', x, y, deltaY);
            this.children.forEach(child => {
                if (child instanceof View) child.wheel(x, y, deltaY)
            })
        }
    }

    click(x: number, y: number): boolean {
        let hit = false;
        for (let i = this.children.length - 1; i >= 0; i--) {
            hit = this.children[i].click(x, y);
            if(hit)
                return hit;
        }
        return super.click(x, y);
    }

    dblClick(x:number, y:number){
        let hit = false;
        for (let i = this.children.length - 1; i >= 0; i--) {
            hit = this.children[i].dblClick(x, y);
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
}