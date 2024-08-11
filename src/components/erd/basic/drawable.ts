import {View} from "@/components/erd/basic/view";

export interface Drawable {
    parent: View | null;
    layout(): void;
    draw(context: CanvasRenderingContext2D):void;

    isInArea(x: number, y: number):boolean;
    mouseDown(x: number, y: number): void;
    mouseMove(x: number, y: number, overlay:boolean): boolean;
    mouseUp(x: number, y: number):void;
    wheel(x:number, y:number, deltaY:number):void;
    click(x: number, y: number): boolean;
    dblClick(x:number, y:number):boolean;
}

export function isDrawable(obj:object): obj is Drawable{
    return 'draw' in obj && 'layout' in obj && 'parent' in obj;
}