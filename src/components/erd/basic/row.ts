import {View} from "./view";
import {Element} from "./element";
import {Point} from "@/components/erd/basic/point";

export enum JustifyContent{
    SpaceBetween,
    SpaceAround,
    Center,
    Left,
    Right
}

export class Row extends View {
    justifyContent: JustifyContent;
    constructor(children:Element[] = []) {
        super(children);
        this.justifyContent = JustifyContent.Left;
    }
    layout() {
        let maxHeight = Number.MIN_SAFE_INTEGER;
        let sumWidth = 0;
        this.children.forEach(child => {
            child.layout();
            maxHeight = Math.max(maxHeight, child.getHeight());
            sumWidth += child.getWidth();
        });
        this.size.height = maxHeight;
        this.size.width = sumWidth;
    }

    draw(context:CanvasRenderingContext2D) {
        super.draw(context);
        let leftChildX = this.position.x + this.getLeftPadding();
        let rightChildX = this.position.x + this.size.width - this.getRightPadding();
        this.children.forEach((child, index) => {
            if(this.justifyContent == JustifyContent.Left || this.justifyContent == JustifyContent.SpaceBetween && index < this.children.length / 2) {
                child.position.x = leftChildX + child.getLeftMargin() + child.getBorderWidth();
                leftChildX += child.getWidth();
            } else if(this.justifyContent == JustifyContent.Right || this.justifyContent == JustifyContent.SpaceBetween && this.children.length / 2 <= index){
                rightChildX -= child.getWidth();
                child.position.x = rightChildX + child.getRightMargin() + child.getBorderWidth();
            }
            child.position.y = this.position.y + this.getTopPadding() + child.getTopMargin();
            child.draw(context);
        })
    }

    setJustifyContent(justifyContent:JustifyContent){
        this.justifyContent = justifyContent;
        return this;
    }
}