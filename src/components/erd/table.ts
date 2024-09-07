import { v4 as uuid } from 'uuid';
import {Column} from "./basic/column";
import {Text} from "@/components/erd/basic/text";
import {TableColumn} from "@/components/erd/table-column";
import {State} from "@/components/erd/basic/state";
import {Selectable} from "@/components/erd/basic/selectable";
import {HorizontalLine} from "@/components/erd/basic/horizontal-line";
import {Reference} from "@/components/erd/reference";
import "./utils"
import {Erd} from "@/components/erd/erd";

export class Table extends Column implements Selectable {
    public readonly id: string;
    isSelected: State<boolean> = new State<boolean>(false);
    private _name: State<string> = new State<string>("");
    private _primaryKeyColumns: TableColumn[] = [];
    private _columns: TableColumn[] = [];

    constructor(id = uuid()) {
        super();
        this.id = id;

        const databaseName = new Text(this._name.value).setMargin(2, 2, 2, 2).setTextColor("white")
        this._name.addListener('change', newName => databaseName.setText(newName))

        const pkColumns = new Column(this._primaryKeyColumns).setContentWidthFitToParent(true);
        const divider = new HorizontalLine().setWidth(150).setHeight(2).setBackground("#575b68").setMargin(2, 2, 2, 2);
        const nonPkColumns = new Column(this._columns).setContentWidthFitToParent(true);
        this.addListener('add-column', column => {column.primaryKey ? column.parent = pkColumns : column.parent = nonPkColumns});
        const databaseColumn = new Column([
            pkColumns,
            divider,
            nonPkColumns
        ])
            .setBackground("#24262d")
            .setContentWidthFitToParent(true)
            .setBorderColor("#575b68")
            .setBorderWidth(3)
            .setPadding(5, 5, 5, 5);

        this.setMargin(5, 5, 5, 5)
            .setBackground("rgba(36,38,45,0)")
            .setDraggable(true)
            .setClip(true)
            .setBackground("rgba(36,38,45,0)")
            .setDraggable(true)
            .addChild(databaseName)
            .addChild(databaseColumn)

        this.addListener('hover', () => {
            if (!this.isSelected.value)
                databaseColumn.setBorderColor("#9498a6");
        })
        this.addListener('leaver', () => {
            if (!this.isSelected.value)
                databaseColumn.setBorderColor("#575b68");
        })
        this.isSelected.addListener('change', value => {
            if (value)
                databaseColumn.setBorderColor('blue')
            else
                databaseColumn.setBorderColor("#575b68");
        })
    }

    addColumn(columnArgs:{name?:string, type?:string, primaryKey?:boolean}, index = -1){
        const columnName: string = columnArgs.name || this.generateUniqueColumnName();
        const column = new TableColumn(columnName);
        column.type = columnArgs.type || "";
        column.primaryKey = columnArgs.primaryKey || false;
        this.addColumnWithColumn(column, index);
        return column;
    }

    addColumnWithColumn(column: TableColumn, index = -1) {
        if (column.primaryKey) {
            if (index >= 0)
                this._primaryKeyColumns.splice(index, 0, column);
            else
                this._primaryKeyColumns.push(column)
            this.emit("add-column", column)
        } else {
            if (index >= 0)
                this._columns.splice(index, 0, column);
            else
                this._columns.push(column)
            this.emit("add-column", column)
        }
    }

    removeColumn(column: TableColumn) {
        if (column.primaryKey) {
            const index = this._primaryKeyColumns.indexOf(column);
            if (index != -1){
                this._primaryKeyColumns.remove(index);
                this.emit("remove-column")
            }
        } else{
            const index = this._columns.indexOf(column);
            if (index != -1){
                this._columns.remove(index);
                this.emit("remove-column")
            }
        }
    }

    get columns() {
        return this._columns;
    }

    setSelected(isSelected: boolean) {
        this.isSelected.value = isSelected;
    }

    click(x: number, y: number): boolean {
        if (this.isSelected.value)
            return super.click(x, y);
        else if (this.isInArea(x, y)) {
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

    get name(): string {
        return this._name.value;
    }

    set name(value: string) {
        this._name.value = value;
    }

    get primaryKeyColumns(): TableColumn[] {
        return this._primaryKeyColumns;
    }

    private generateUniqueColumnName() {
        const counter = this.primaryKeyColumns.length + this.columns.length;
        let columnName = "col_" + counter;
        while(this.isColumnWithName(columnName)){
            columnName = columnName + "_1"
        }
        return columnName;
    }

    isColumnWithName(name: string){
        return this.getColumnWithName(name) != null;
    }

    getColumnWithName(name: string){
        for (const column of this.columns){
            if(column.name == name)
                return column;
        }
        for (const column of this.primaryKeyColumns){
            if (column.name == name)
                return column
        }
        return null;
    }

    exportDatabaseModel() {
        const columnsModel = [];
        const primaryKeyColumnsModel = [];

        for (const column of this.columns) {
            columnsModel.push(column.exportDatabaseModel())
        }

        for (const column of this.primaryKeyColumns) {
            primaryKeyColumnsModel.push(column.exportDatabaseModel())
        }

        return {
            id: this.id,
            name: this.name,
            columns: columnsModel,
            pkColumns: primaryKeyColumnsModel,
        } as TableDatabaseModel
    }

    importDatabaseModel(tableDatabaseModel: TableDatabaseModel) {
        this.name = tableDatabaseModel["name"];

        for (const columnDatabaseModel of tableDatabaseModel.columns) {
            const column = new TableColumn("");
            column.importDatabaseModel(columnDatabaseModel);
            this.addColumnWithColumn(column);
        }

        for (const columnDatabaseModel of tableDatabaseModel.pkColumns) {
            const column = new TableColumn("");
            column.importDatabaseModel(columnDatabaseModel);
            this.addColumnWithColumn(column);
        }
    }

    exportDiagramModel() {
        return {
            id: this.id,
            x: this.position.x,
            y: this.position.y
        }
    }

    importDiagramModel(tableDiagramModel: TableDiagramModel) {
        this.position.set(tableDiagramModel.x, tableDiagramModel.y);
    }

    getColumnById(id: string) {
        for (const column of this.columns) {
            if (column.id == id)
                return column
        }

        for (const column of this.primaryKeyColumns) {
            if (column.id == id)
                return column
        }
        return null
    }
}