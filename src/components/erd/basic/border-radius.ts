export class BorderRadius {
    topLeft: number;
    topRight: number;
    bottomRight: number;
    bottomLeft: number;

    constructor(topLeft = 0, topRight = 0, bottomRight = 0, bottomLeft = 0) {
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomRight = bottomRight;
        this.bottomLeft = bottomLeft;
    }
}