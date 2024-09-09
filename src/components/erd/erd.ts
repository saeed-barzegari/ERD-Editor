import {Canvas} from "@/components/erd/basic/canvas";
import {Viewport} from "@/components/erd/basic/viewport";
import {Table} from "@/components/erd/table";
import {Reference} from "@/components/erd/reference";
import {Point} from "@/components/erd/basic/point";
import {diagramToMySQLCode} from "@/components/erd/code-generation/mysql";
import {TableColumn} from "@/components/erd/table-column";

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
    references: Reference[] = [];
    tables: Table[] = [];
    private tableCounter = 1;
    table: Table | null = null;
    reference: Reference | null = null
    mode = ERDMode.Editing;

    constructor() {
        super();
        this.background = "#1c1e24";

        this.addListener('click', () => {
            this.selected.forEach(child => {
                child.setSelected(false);
            })
        })
    }

    mouseHandler() {
        super.mouseHandler();
        this.addListener('mousedown', (x:number, y:number)=>{
            const [localX, localY] = this.convertGlobalPositionXYToLocal(x, y);
            if(this.mode == ERDMode.Referencing) {
                this.tables.forEach(table => {
                    if (table.isInArea(localX, localY)) {
                        if (this.table)
                            this.addReferenceWithReference(new Reference(this.table, table))
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
            this.tables.forEach(table => {
                if (table.isInArea(localMousePosition.x, localMousePosition.y)) {
                    hit = true;
                    this.emit('contextmenu', mousePosition, ContextMenuContent.TableContextMenu);
                    this.table = table;
                }
            })
            if (hit) return;

            this.references.forEach(ref => {
                if (ref.isInArea(localMousePosition.x, localMousePosition.y)) {
                    hit = true;
                    this.emit('contextmenu', mousePosition, ContextMenuContent.ReferenceContextMenu)
                    this.reference = ref;
                }
            })
            if (hit) return;

            if (this.isInArea(mousePosition.x, mousePosition.y))
                this.emit('contextmenu', mousePosition, ContextMenuContent.CanvasContextMenu)
        })
    }

    addTable(table: Table) {
        this.addChild(table);
        this.tables.push(table);
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
        const table = new Table();
        table.name = tableName;
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
        this.getReferencesByFromTable(table).forEach(ref => {
            this.removeReferenceByReference(ref)
        });
        this.getReferencesByToTable(table).forEach(ref => {
            this.removeReferenceByReference(ref)
        })
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

    getTableById(id: string) {
        for (const table of this.tables) {
            if (table.id == id)
                return table
        }
        return null
    }

    exportProject() {
        return {
            databaseModel: this.exportDatabaseModel(),
            diagramModel: this.exportDiagramModel(),
        } as Project;
    }

    exportDatabaseModel() {
        const tablesModel: TableDatabaseModel[] = []
        const referencesModel: ReferenceDatabaseModel[] = []

        for (const table of this.tables) {
            tablesModel.push(table.exportDatabaseModel());
        }

        for (const reference of this.references) {
            referencesModel.push(reference.exportDatabaseModel())
        }

        return {
            tables: tablesModel,
            references: referencesModel,
        } as DatabaseModel;
    }

    exportDiagramModel() {
        const tablesDiagramModel: TableDiagramModel[] = [];
        for (const table of this.tables) {
            tablesDiagramModel.push(table.exportDiagramModel())
        }
        return {
            diagramTables: tablesDiagramModel,
        } as DiagramModel;
    }

    importDiagramModel(diagramModel: DiagramModel) {
        for (const tableDiagramModel of diagramModel.diagramTables) {
            const table = new Table(tableDiagramModel.id);
            table.importDiagramModel(tableDiagramModel);
            this.addTable(table);
        }
    }

    importProject(p: object) {
        const project = p as Project;
        this.importDiagramModel(project.diagramModel);
        this.importDatabaseModel(project.databaseModel);
    }

    importDatabaseModel(databaseModel: DatabaseModel) {
        for (const tableDatabaseModel of databaseModel.tables) {
            const table = this.getTableById(tableDatabaseModel.id);
            if (!table) continue
            table.importDatabaseModel(tableDatabaseModel);
        }

        for (const referenceDatabaseModel of databaseModel.references) {
            const toTable = this.getTableById(referenceDatabaseModel.toTableId);
            const fromTable = this.getTableById(referenceDatabaseModel.fromTableId);
            if (!toTable || !fromTable) continue;
            const reference = new Reference(fromTable, toTable, true);
            reference.importDatabaseModel(referenceDatabaseModel);
            this.addReferenceWithReference(reference)
        }
    }

    getReferencesByFromTable(table: Table) {
        const references: Reference[] = [];
        for (const reference of this.references) {
            if(reference.fromTable == table)
                references.push(reference);
        }
        return references;
    }

    getReferencesByToTable(table: Table) {
        const references: Reference[] = [];
        for (const reference of this.references) {
            if(reference.toTable == table)
                references.push(reference);
        }
        return references;
    }

    private addReferenceWithReference(reference: Reference) {
        reference.parent = this;
        this.references.push(reference);
        this.children.push(reference);
    }

    generateCode(){
        return diagramToMySQLCode(this);
    }

    zoomFitToContent() {
        if (this.tables.length == 0)
            return;

        let minX = Number.MAX_VALUE, minY = Number.MAX_VALUE
        let maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
        for (const table of this.tables) {
            minX = Math.min(minX, table.getLeftX())
            minY = Math.min(minY, table.getTopY())
            maxX = Math.max(maxX, table.getRightX())
            maxY = Math.max(maxY, table.getBottomY())
        }


        if (this.tables.length > 1) {
            const widthScale = this.getWidth() / (maxX - minX);
            const heightScale = this.getHeight() / (maxY - minY);
            this.scale = Math.min(1, widthScale, heightScale)
        }
        this.offset.set(this.getWidth()/2 - ((minX + maxX) / 2) * this.scale, this.getHeight()/2 - ((minY + maxY) / 2) * this.scale)
    }

    removeActiveReference() {
        if (this.reference)
            this.removeReferenceByReference(this.reference)
    }

    removeReferenceByReference(ref:Reference){
        const indexReferences = this.references.indexOf(ref);
        const indexChildren = this.children.indexOf(ref);
        ref.remove();
        this.references.remove(indexReferences);
        this.children.remove(indexChildren);
    }

    getReferenceById(id: string) {
        for (const reference of this.references) {
            if(reference.id == id)
                return reference;
        }
    }

    differentBetweenVersions(v1: object | null, v2: object){
        const REMOVED_COLOR = "#730707";
        const ADDED_COLOR = "#1e7307";
        const CHANGED_COLOR = "#5f0773";
        const TABLE_DEFAULT_COLOR = "#24262d";
        const COLUMN_DEFAULT_COLOR = "#00000000";
        const REFERENCE_DEFAULT_COLOR = "#FFFFFF";
        const version2 = v2 as Project;

        this.importProject(version2);
        this.tables.forEach(table => {
            table.tableColor = ADDED_COLOR;
        })
        this.references.forEach(reference => {
            reference.setColor(ADDED_COLOR);
        })

        const version1 = v1 as Project;
        console.log(version1)
        if (!version1.databaseModel) return;
        version1.databaseModel.tables.forEach((tableDatabaseModel, index) => {
            const table = this.getTableById(tableDatabaseModel.id);
            if(table == null){
                const table = new Table(tableDatabaseModel.id);
                table.importDiagramModel(version1.diagramModel.diagramTables[index]);
                table.importDatabaseModel(tableDatabaseModel)
                table.tableColor = REMOVED_COLOR;
                this.addTable(table);
            } else {
                table.tableColor = TABLE_DEFAULT_COLOR;
                table.primaryKeyColumns.forEach(column => {
                    column.setBackground(ADDED_COLOR);
                })
                table.columns.forEach(column => {
                    column.setBackground(ADDED_COLOR);
                })
                tableDatabaseModel.pkColumns.forEach(columnDatabaseModel => {
                    const column = table.getColumnById(columnDatabaseModel.id);
                    if (column == null || !column.primaryKey){
                        const column = new TableColumn("");
                        column.importDatabaseModel(columnDatabaseModel);
                        column.setBackground(REMOVED_COLOR)
                        table.addColumnWithColumn(column);
                    } else {
                        if (
                            column.unique != columnDatabaseModel.unique ||
                            column.nullable != columnDatabaseModel.nullable ||
                            column.name != columnDatabaseModel.name ||
                            column.type != columnDatabaseModel.type
                        ){
                            column.setBackground(CHANGED_COLOR)
                        } else {
                            column.setBackground(COLUMN_DEFAULT_COLOR)
                        }
                    }
                })

                tableDatabaseModel.columns.forEach(columnDatabaseModel => {
                    const column = table.getColumnById(columnDatabaseModel.id);
                    if (column == null || column.primaryKey){
                        const column = new TableColumn("");
                        column.importDatabaseModel(columnDatabaseModel);
                        column.setBackground(REMOVED_COLOR)
                        table.addColumnWithColumn(column);
                    } else {
                        if (
                            column.unique != columnDatabaseModel.unique ||
                            column.nullable != columnDatabaseModel.nullable ||
                            column.name != columnDatabaseModel.name ||
                            column.type != columnDatabaseModel.type
                        ){
                            column.setBackground(CHANGED_COLOR)
                        } else {
                            column.setBackground(COLUMN_DEFAULT_COLOR)
                        }
                    }
                })
            }
        })

        for (const referenceDatabaseModel of version1.databaseModel.references) {
            const reference = this.getReferenceById(referenceDatabaseModel.id);
            if (reference == null){
                const toTable = this.getTableById(referenceDatabaseModel.toTableId);
                const fromTable = this.getTableById(referenceDatabaseModel.fromTableId);
                if (!toTable || !fromTable) continue;
                const reference = new Reference(fromTable, toTable, true);
                reference.setColor(REMOVED_COLOR)
                reference.importDatabaseModel(referenceDatabaseModel);
                this.addReferenceWithReference(reference)
            }else {
                reference.setColor(REFERENCE_DEFAULT_COLOR);
            }
        }
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

