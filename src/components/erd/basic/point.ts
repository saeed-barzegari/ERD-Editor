export class Point{
    x:number;
    y:number;
    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    add(x:number, y:number){
        this.x += x;
        this.y += y;
        return this;
    }

    sub(x:number, y:number){
        this.x -= x;
        this.y -= y;
        return this;
    }

    addPoint(point:Point){
        this.x += point.x;
        this.y += point.y;
        return this;
    }

    subPoint(point:Point){
        this.x -= point.x;
        this.y -= point.y;
        return this;
    }

    mul(z:number){
        this.x *= z;
        this.y *= z;
        return this;
    }

    div(z:number){
        this.x /= z;
        this.y /= z;
        return this;
    }

    copy(){
        return new Point(this.x, this.y)
    }

    set(x:number, y:number){
        this.x = x;
        this.y = y;
        return this;
    }
}