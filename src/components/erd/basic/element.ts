import {BoundingBox} from "./bounding-box";
import {Size} from "./size";
import {Point} from "./point";
import {BorderRadius} from "./border-radius";
import {EventEmitter} from "events";
import {Canvas} from "@/components/erd/basic/canvas";
import {View} from "@/components/erd/basic/view";

export abstract class Element extends EventEmitter {
    parent: Element | null;
    protected padding: BoundingBox;
    protected margin: BoundingBox;
    size: Size;
    position: Point;
    protected background: string;
    protected borderRadius: BorderRadius;
    protected borderColor: string;
    protected borderWidth: number;
    protected draggable: boolean;
    protected dragListener: (mouseX: number, mouseY: number) => void;
    protected isHovered;
    private _hidden;

    protected constructor() {
        super();
        this.parent = null;
        this.padding = new BoundingBox();
        this.margin = new BoundingBox();
        this.size = new Size();
        this.position = new Point();
        this.background = "#00000000";
        this.borderRadius = new BorderRadius();
        this.borderColor = "#00000000";
        this.borderWidth = 0;
        this.draggable = false;
        this.isHovered = false;
        this._hidden = false;


        this.dragListener = (mouseX: number, mouseY: number) => {
            if (!this.isInArea(mouseX, mouseY))
                return;

            const x = this.position.x - mouseX;
            const y = this.position.y - mouseY;
            const mouseMoveListener = (mouseMoveX: number, mouseMoveY: number) => {
                this.position.x = mouseMoveX + x;
                this.position.y = mouseMoveY + y;

            }
            this.addListener('mousemove', mouseMoveListener)

            const mouseUpListener = () => {
                this.removeListener('mousemove', mouseMoveListener);
                this.removeListener('mouseup', mouseUpListener);
            }
            this.addListener('mouseup', mouseUpListener)
        }
    }

    abstract layout(): void;//todo: fit content to parent in size and enum and define content size

    draw(context: CanvasRenderingContext2D) {
        if (this._hidden) return;

        context.fillStyle = this.background;
        context.beginPath();
        context.roundRect(this.position.x, this.position.y, this.size.width, this.size.height, [this.borderRadius.topLeft, this.borderRadius.topRight, this.borderRadius.bottomRight, this.borderRadius.bottomLeft]);
        context.strokeStyle = this.borderColor
        context.lineWidth = this.borderWidth;
        context.stroke();
        context.fill();
    }

    widthFitToParent() {
        if (this.parent)
            this.size.width = this.parent.getInnerWidth() - this.getHorizontalMargin() - 2 * this.borderWidth;
    }

    heightFitToParent() {
        if (this.parent)
            this.size.height = this.parent.getInnerHeight() - this.getVerticalMargin() - 2 * this.borderWidth;
    }

    setDraggable(draggable: boolean) {
        if (draggable && this.draggable || !draggable && !this.draggable)
            return this
        this.draggable = draggable;
        if (draggable) {
            this.addListener("mousedown", this.dragListener)
        } else {
            this.removeListener("mousedown", this.dragListener)
        }
        return this
    }

    setMargin(top: number, right: number, bottom: number, left: number) {
        this.margin.top = top;
        this.margin.right = right;
        this.margin.bottom = bottom;
        this.margin.left = left;
        return this
    }

    setPadding(top: number, right: number, bottom: number, left: number) {
        this.padding.top = top;
        this.padding.right = right;
        this.padding.bottom = bottom;
        this.padding.left = left;
        return this
    }

    setBorderRadius(topLeft: number, topRight: number, bottomRight: number, bottomLeft: number,) {
        this.borderRadius.topLeft = topLeft;
        this.borderRadius.topRight = topRight;
        this.borderRadius.bottomRight = bottomRight;
        this.borderRadius.bottomLeft = bottomLeft;
        return this;
    }

    mouseDown(x: number, y: number) {
        if (this.isInArea(x, y))
            this.emit('mousedown', x, y);
    }

    mouseUP(x: number, y: number) {
        this.emit('mouseup', x, y);
    }

    click(x: number, y: number) {
        if (this.isInArea(x, y)) {
            this.emit('click', x, y);
            return true;
        }
        return false;
    }

    dblClick(x: number, y: number) {
        if (this.isInArea(x, y)) {
            this.emit('dblclick', x, y);
            return true;
        }
        return false;
    }

    mouseMove(x: number, y: number, overlay = false) {
        this.emit('mousemove', x, y);
        return this.hoverCheck(x, y, overlay);
    }

    protected hoverCheck(x: number, y: number, overlay = false){
        if (overlay) {
            if (this.isHovered) {
                this.emit('leaver');
                this.isHovered = false;
            }
            return this.isInArea(x, y);
        }

        if (this.isInArea(x, y)) {
            if (!this.isHovered) {
                this.emit('hover')
                this.isHovered = true;
            }
            return true;
        } else {
            if (this.isHovered) {
                this.emit('leaver');
                this.isHovered = false;
            }
        }
        return false;
    }

    setBackground(color: string) {
        this.background = color;
        return this;
    }

    isInArea(x: number, y: number) {
        return this.position.x <= x &&
            x <= (this.position.x + this.size.width) &&
            this.position.y <= y &&
            y <= (this.position.y + this.size.height)
    }

    setBorderColor(color: string) {
        this.borderColor = color;
        return this;
    }

    setBorderWidth(width: number) {
        this.borderWidth = width;
        return this;
    }

    getWidth() {
        return this.size.width + this.getHorizontalMargin() + 2 * this.getBorderWidth();
    }

    setWidth(width: number) {
        this.size.width = width;
        return this;
    }

    getHorizontalMargin() {
        return this.margin.left + this.margin.right;
    }

    getHeight() {
        return this.getVerticalMargin() + this.size.height + 2 * this.borderWidth;
    }

    setHeight(height: number) {
        this.size.height = height;
        return this;
    }

    getVerticalMargin() {
        return this.margin.top + this.margin.bottom;
    }

    getTopMargin() {
        return this.margin.top;
    }

    getBottomMargin() {
        return this.margin.bottom;
    }

    getLeftMargin() {
        return this.margin.left;
    }

    getRightMargin() {
        return this.margin.right;
    }

    getTopPadding() {
        return this.padding.top;
    }

    getBottomPadding() {
        return this.padding.bottom;
    }

    getLeftPadding() {
        return this.padding.left;
    }

    getRightPadding() {
        return this.padding.right;
    }

    getVerticalPadding() {
        return this.padding.top + this.padding.bottom;
    }

    getHorizontalPadding() {
        return this.padding.left + this.padding.right;
    }

    getBorderWidth() {
        return this.borderWidth
    }

    setParent(element: Element) {
        this.parent = element;
    }

    getCenterX() {
        return this.position.x + this.size.width / 2
    }

    getLeftX() {
        return this.position.x
    }

    getRightX() {
        return this.position.x + this.size.width
    }

    getCenterY() {
        return this.position.y + this.size.height / 2
    }

    getTopY() {
        return this.position.y
    }

    getBottomY() {
        return this.position.y + this.size.height
    }

    get hidden() {
        return this._hidden;
    }

    set hidden(value) {
        this._hidden = value;
    }

    setHidden(hidden: boolean) {
        this._hidden = hidden;
        return this;
    }

    getGlobalPosition() {
        let parent = this.parent;
        let pos = this.position.copy()
        while(parent !== null){
            if (!(parent instanceof View)) continue;
            pos = (parent as View).convertLocalPositionToGlobal(pos);
            parent = parent.parent;
        }
        return pos;
    }

    setGlobalPosition(x: number, y: number) {
        let parent = this.parent;
        const viewStack:View[] = [];
        let pos = new Point(x, y);
        while(parent !== null) {
            if (!(parent instanceof View)) continue;
            viewStack.push(parent);
            parent = parent.parent;
        }
        while (viewStack.length != 0){
            const view = viewStack.pop();
            if (view == null) continue;
            pos = view.convertGlobalPositionToLocal(pos);
            console.log("convert")
        }
        this.position.set(pos.x, pos.y);
    }

    getInnerWidth(){
        return this.size.width - this.getHorizontalPadding();
    }

    getInnerHeight(){
        return this.size.height - this.getVerticalPadding();
    }
}