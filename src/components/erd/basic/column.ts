import {View} from "./view";
import {Element} from "./element";

export class Column extends View {
    contentWidthFitToParent: boolean;

    constructor(children: Element[] = []) {
        super(children);
        this.contentWidthFitToParent = false;
    }

    layout() {
        let maxWidth = Number.MIN_SAFE_INTEGER;
        let sumHeight = 0;
        this.children.forEach(child => {
            child.layout();
            maxWidth = Math.max(child.getWidth(), maxWidth);
            sumHeight += child.getHeight();
        });
        this.size.height = sumHeight + this.getVerticalPadding();
        this.size.width = maxWidth + this.getHorizontalPadding();
        if (this.contentWidthFitToParent)
            this.children.forEach(child => {
                child.widthFitToParent();
            })
    }

    draw(context:CanvasRenderingContext2D) {
        super.draw(context);
        let childY = this.position.y + this.getTopPadding();
        this.children.forEach(child => {
            child.position.y = childY + child.getTopMargin() + child.getBorderWidth();
            child.position.x = this.position.x + this.getLeftPadding() + child.getLeftMargin() + child.getBorderWidth();
            childY += child.getHeight();
        })

        if (this.clip) {
            context.save();
            context.clip();
        }
        this.children.forEach(child => child.draw(context));
        if (this.clip) {
            context.restore();
        }
    }



    setContentWidthFitToParent(contentWidthFitToParent: boolean) {
        this.contentWidthFitToParent = contentWidthFitToParent;
        return this
    }

    widthFitToParent() {
        super.widthFitToParent();
        if (this.contentWidthFitToParent)
            this.children.forEach(child => {
                child.widthFitToParent();
            })
    }
}