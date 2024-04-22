import {Element} from "@/components/erd/basic/element";
import {Size} from "@/components/erd/basic/size";
import {Canvas} from "@/components/erd/basic/canvas";

export class Text extends Element {
    protected text;
    protected textColor: string;
    protected fontSize: number;

    constructor(text: string) {
        super();
        this.text = text;
        this.textColor = "#000000";
        this.fontSize = 14;
    }

    layout() {
        const context = Canvas.getSingleton().context;
        context.font = (this.fontSize) + "px Arial";
        context.textBaseline = 'top';
        const textMetrics = context.measureText(this.text);
        this.size.height = (Math.round(Math.abs(textMetrics.actualBoundingBoxAscent) + Math.abs(textMetrics.actualBoundingBoxDescent))) + this.getVerticalPadding();
        this.size.width = textMetrics.width + this.getHorizontalPadding();
    }

    draw(context:CanvasRenderingContext2D) {
        if(this.hidden) return;

        super.draw(context);
        const position = this.position.copy().add(this.getLeftPadding(), this.getTopPadding());
        context.font = (this.fontSize) + "px Arial";
        context.fillStyle = this.textColor;
        context.textBaseline = 'top';
        context.fillText(this.text, position.x, position.y);
    }

    setText(text: string) {
        this.text = text;
        return this
    }

    setTextColor(color: string) {
        this.textColor = color;
        return this
    }

    getFontSize() {
        return this.fontSize;
    }

    setFontSize() {
        return this.fontSize;
    }
}