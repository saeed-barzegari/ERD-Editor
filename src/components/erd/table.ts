import {Column} from "./basic/column";
import {Text} from "@/components/erd/basic/text";
import {TableColumn} from "@/components/erd/table-column";
import {State} from "@/components/erd/basic/state";
import {Selectable} from "@/components/erd/basic/selectable";
import {HorizontalLine} from "@/components/erd/basic/horizontal-line";
import {Reference} from "@/components/erd/reference";
import "./utils"

export class Table extends Column implements Selectable {
    isSelected: State<boolean> = new State<boolean>(false);
    private _name: State<string> = new State<string>("");
    private _primaryKeyColumns: TableColumn[] = [];
    private _columns: TableColumn[] = [];
    private _references: Reference[] = [];

    constructor(name: string) {
        super();
        this.name = name;

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

    addColumn(column: TableColumn, index = -1) {
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
            console.log('click')
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

    addReference(parent: Table) {
        this._references.push(new Reference(parent, this))
    }

    get primaryKeyColumns(): TableColumn[] {
        return this._primaryKeyColumns;
    }
}