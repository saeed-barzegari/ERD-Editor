import {Canvas} from "@/components/erd/basic/canvas";
import {Viewport} from "@/components/erd/basic/viewport";
import {Table} from "@/components/erd/table";
import {Reference} from "@/components/erd/reference";
import {Point} from "@/components/erd/basic/point";

export enum ContextMenuContent {
    TableContextMenu,
    CanvasContextMenu,
    ReferenceContextMenu
}

export enum ERDMode{
    Editing,
    Referencing,
}

export class Erd extends Viewport {
    reference: Reference[] = [];
    tableCounter = 1;
    table = new Table("");
    mode = ERDMode.Editing;

    constructor() {
        super();

        for (let i = 0; i < 2; i++) { // todo: remove
            this.addTableWithGlobalPos(i * 200, i * 100)
        }
        this.reference.push(new Reference(<Table>this.children[0], <Table>this.children[1]));

        this.addListener('click', () => {
            this.selected.forEach(child => {
                child.setSelected(false);
            })
        })
    }

    mouseHandler() {
        super.mouseHandler();
        this.addListener('mousedown', (x:number, y:number)=>{
            console.log('mouse down ref')
            if(this.mode == ERDMode.Referencing) {
                this.children.forEach(child => {
                    if (child.isInArea(x, y)) {
                        this.reference.push(new Reference(this.table, child as Table));
                        this.mode = ERDMode.Editing;
                    }
                })
            }
        })
        document.addEventListener('contextmenu', ev => {
            if (this.mode == ERDMode.Referencing){
                this.mode = ERDMode.Editing;
                return;
            }

            let hit = false;
            const mousePosition = this.convertToGlobal(new Point(ev.offsetX, ev.offsetY))
            this.children.forEach(child => {
                if (child.isInArea(mousePosition.x, mousePosition.y)) {
                    hit = true;
                    this.table = child as Table;
                    this.emit('contextmenu', mousePosition, ContextMenuContent.TableContextMenu);
                }
            })
            if (hit) return;

            this.reference.forEach(ref => {
                if (ref.isInArea(mousePosition.x, mousePosition.y)) {
                    hit = true;
                    this.emit('contextmenu', mousePosition, ContextMenuContent.ReferenceContextMenu)
                }
            })
            if (hit) return;

            if (this.isInArea(mousePosition.x, mousePosition.y))
                this.emit('contextmenu', mousePosition, ContextMenuContent.CanvasContextMenu)
        })
    }

    addTable(table: Table) {
        this.addChild(table);
        this.emit('edit-table', table);
        this.table = table;
        table.addListener('click', () => {
            this.selected.forEach(selectedTable => selectedTable.setSelected(false)) // TODO: MOVE TO VIEWPORT
            table.setSelected(true);
            this.selected.push(table);
            this.table = table;
        })
        table.addListener('dblclick', () => {
            this.emit('edit-table', table);
            this.table = table;
        })
    }

    addTableWithGlobalPos(x: number, y: number) {
        const table = new Table("table_" + this.tableCounter);
        this.tableCounter++;
        table.setGlobalPosition(x, y);
        this.addTable(table);
        return table;
    }

    draw(context: CanvasRenderingContext2D) {
        this.reference.forEach(child => child.draw(context))
        super.draw(context);
    }

    setReferencingMode(){
        this.mode = ERDMode.Referencing;
    }

    setEditingMode(){
        this.mode = ERDMode.Editing;
    }

    isReferencingMode(){
        return this.mode == ERDMode.Referencing;
    }

    isEditingMode(){
        return this.mode == ERDMode.Referencing;
    }
}


let displayWidth = 1280;
let displayHeight = 739;
const scale = 1;
let erd: Erd;

export function show(canvas: HTMLCanvasElement, parent: HTMLElement, e: Erd) {
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;

    erd = e;
    Canvas.getSingleton()
        .setContext(ctx)
        .setResolution(scale)
        .setRoot(erd)

    canvas.style.width = String(parent.offsetWidth);
    canvas.style.height = String(parent.offsetHeight);
    canvas.width = parent.offsetWidth * scale;
    canvas.height = parent.offsetHeight * scale;


    parent.addEventListener('resize', () => {
        console.log('resize')
    })
    window.onresize = function () {
        canvas.style.width = String(parent.clientWidth);
        canvas.style.height = String(parent.offsetHeight);
        canvas.width = parent.offsetWidth * scale;
        canvas.height = parent.offsetHeight * scale;

        displayWidth = parent.offsetWidth
        displayHeight = parent.offsetHeight
    }


    displayWidth = parent.offsetWidth
    displayHeight = parent.offsetHeight

    canvas.style.background = "#1c1e24";


    requestAnimationFrame(draw)
}

function draw() {
    const context = Canvas.getSingleton().context
    const ratio = Canvas.getSingleton().ratio
    const offset = Canvas.getSingleton().offset

    context.reset();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.scale(ratio, ratio)
    context.translate(offset.x, offset.y)

    erd.position.x = -offset.x
    erd.position.y = -offset.y
    erd.size.width = displayWidth / ratio
    erd.size.height = displayHeight / ratio

    erd.layout();
    erd.draw(context)


    requestAnimationFrame(draw)
}

