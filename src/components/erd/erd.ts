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
    private references: Reference[] = [];//todo removed
    private tables: Table[] = [];
    private tableCounter = 1;
    table = new Table("");
    mode = ERDMode.Editing;

    constructor() {
        super();

        for (let i = 0; i < 2; i++) { // todo: remove
            this.addTableWithGlobalPos(i * 200, i * 100)
        }
        this.references.push(new Reference(<Table>this.children[0], <Table>this.children[1]));

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
                        this.references.push(new Reference(this.table, child as Table));
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
            const mousePosition = new Point(ev.offsetX, ev.offsetY);
            const localMousePosition = this.convertGlobalPositionToLocal(mousePosition.copy())
            this.children.forEach(child => {
                if (child.isInArea(localMousePosition.x, localMousePosition.y)) {
                    hit = true;
                    this.table = child as Table;
                    this.emit('contextmenu', mousePosition, ContextMenuContent.TableContextMenu);
                }
            })
            if (hit) return;

            this.references.forEach(ref => {
                if (ref.isInArea(localMousePosition.x, localMousePosition.y)) {
                    hit = true;
                    this.emit('contextmenu', mousePosition, ContextMenuContent.ReferenceContextMenu)
                }
            })
            if (hit) return;

            if (this.isInArea(localMousePosition.x, localMousePosition.y))
                this.emit('contextmenu', mousePosition, ContextMenuContent.CanvasContextMenu)
        })
    }

    addTable(table: Table) {
        this.addChild(table);
        this.tables.push(table);
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
        const tableName = this.generateUniqueTableName();
        const table = new Table(tableName);
        this.tableCounter++;
        this.addTable(table);
        table.setGlobalPosition(x, y);
        return table;
    }

    private generateUniqueTableName(){
        let name = "table_" + this.tableCounter;
        while (this.hasTableName(name)){
            this.tableCounter++;
            name = "table_" + this.tableCounter;
        }
        return name;
    }

    private hasTableName(name:string){
        for (const table of this.tables) {
            if(table.name == name)
                return true;
        }
        return false;
    }

    removeTable(table:Table){
        const index = this.tables.indexOf(table);
        this.tables.remove(index);
        this.removeChild(table);
    }

    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.scale(this.scale, this.scale);
        context.translate(this.offset.x, this.offset.y);
        this.references.forEach(child => child.draw(context))
        context.restore();
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
    const resolution = Canvas.getSingleton().resolution

    context.reset();
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.scale(resolution, resolution)

    erd.size.width = displayWidth / resolution
    erd.size.height = displayHeight / resolution

    erd.layout();
    erd.draw(context)


    requestAnimationFrame(draw)
}

