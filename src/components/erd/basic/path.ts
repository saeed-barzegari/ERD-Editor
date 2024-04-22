import {Point} from "@/components/erd/basic/point";

export class Path {
    private _positions: Point[];
    private _color:string;

    constructor(color = "white") {
        this._positions = [];
        this._color = color;
    }

    setColor(color:string){
        this._color = color;
        return this;
    }

    addPoint(x: number, y: number) {
        this._positions.push(new Point(x, y));
        return this;
    }

    change(index: number, x: number, y: number) {
        this._positions[index].x = x;
        this._positions[index].y = y;
    }

    draw(context: CanvasRenderingContext2D) {
        if (this._positions.length == 0) return;

        context.save();
        context.beginPath();
        context.strokeStyle = this._color
        context.lineWidth = 1;
        context.setLineDash([5, 5])
        context.moveTo(this._positions[0].x, this._positions[0].y)
        for (let i = 1; i < this._positions.length; i++) {
            const position = this._positions[i];
            context.lineTo(position.x, position.y)
        }
        context.stroke();
        context.restore();
    }

    isInArea(x: number, y: number) {
        const distance = 5;
        if (this._positions.length == 0)
            return false;
        if (this._positions.length == 1)
            return Math.abs(x - this._positions[0].x) <= distance && Math.abs(y - this._positions[0].y) <= distance;
        for (let i = 0; i < this._positions.length - 1; i++) {
            const first_pos = this._positions[i];
            const second_pos = this._positions[i + 1];
            if (first_pos.y == second_pos.y && first_pos.x == second_pos.x) {
                if (Math.abs(x - first_pos.x) <= distance && Math.abs(y - first_pos.y) <= distance)
                    return true
            } else if (first_pos.x == second_pos.x) {
                const x_line = ((second_pos.x - first_pos.x) / (second_pos.y - first_pos.y)) * (y - first_pos.y) + first_pos.x;
                if (Math.abs(x - x_line) <= distance)
                    return true;
            } else {
                const y_line = ((second_pos.y - first_pos.y) / (second_pos.x - first_pos.x)) * (x - first_pos.x) + first_pos.y;
                if (Math.abs(y - y_line) <= distance)
                    return true;
            }
        }

        return false;
    }
}